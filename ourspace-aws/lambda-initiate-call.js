// OurSpace 2.0 — AWS Lambda: initiateCall
// Signaling server: validates recipient, writes to NotificationLedger, sends push
// Runtime: Node.js 20.x
// IAM needs: secretsmanager:GetSecretValue, dynamodb:PutItem, dynamodb:GetItem

const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const dynamo = new DynamoDBClient({ region: "us-east-1" });
const secrets = new SecretsManagerClient({ region: "us-east-1" });

const LEDGER_TABLE = "OurSpace_NotificationLedger";
const MAX_RETRIES = 3;

// ── Exponential backoff retry ────────────────────────────────────────────────
async function withRetry(fn, retries = MAX_RETRIES, delay = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`[Retry] Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
}

// ── Write to NotificationLedger (atomic) ────────────────────────────────────
async function writeLedgerEntry(callId, callerId, recipientEmail, status) {
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30-day TTL
  const command = new PutItemCommand({
    TableName: LEDGER_TABLE,
    Item: {
      callId:         { S: callId },
      callerId:       { S: callerId },
      recipientEmail: { S: recipientEmail },
      status:         { S: status },
      timestamp:      { N: String(Date.now()) },
      ttl:            { N: String(ttl) },
      // FCC/I-VoIP compliance: metadata only, NO call content
      metadataOnly:   { BOOL: true },
    },
    // Atomic: only write if callId doesn't exist yet
    ConditionExpression: "attribute_not_exists(callId)",
  });
  return await withRetry(() => dynamo.send(command));
}

// ── Main Lambda Handler ──────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://our-space-vibes.base44.app",
    "Content-Type": "application/json",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { callerId, callerName, recipientEmail, callId, callerAge } = body;

    if (!callerId || !recipientEmail || !callId) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields." }) };
    }

    // ── Age Gate (ASA Law Compliance) ────────────────────────────────────────
    if (callerAge && callerAge < 18) {
      // Under-18: only allow calls to confirmed friends with parental consent
      const consentCheck = await dynamo.send(new GetItemCommand({
        TableName: "OurSpace_Users",
        Key: { email: { S: callerId } },
      }));
      const userRecord = consentCheck.Item;
      const hasConsent = userRecord?.parental_consent?.BOOL === true;
      const isFriendsOnly = userRecord?.privacy_level?.S === "friends_only";

      if (!hasConsent || !isFriendsOnly) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            error: "MINOR_RESTRICTED",
            message: "Calls for users under 18 require parental consent and Friends Only privacy setting.",
          }),
        };
      }
    }

    // ── Step 1: Write to NotificationLedger BEFORE returning "Ringing" ───────
    // Per spec: server must NOT return Ringing until ledger write is confirmed
    await writeLedgerEntry(callId, callerId, recipientEmail, "initiated");
    console.log("[Ledger] Entry confirmed for callId:", callId);

    // ── Step 2: Fetch VAPID keys from Secrets Manager ─────────────────────
    const secretData = await secrets.send(new GetSecretValueCommand({
      SecretId: "ourspace/vapid-keys",
    }));
    const { privateKey, publicKey } = JSON.parse(secretData.SecretString);

    // ── Step 3: Send push notification to recipient ────────────────────────
    // (Using web-push library — must be in Lambda layer or bundled)
    const webpush = require("web-push");
    webpush.setVapidDetails("mailto:support@ourspace.com", publicKey, privateKey);

    // Fetch recipient's push subscription from DB
    const recipientData = await dynamo.send(new GetItemCommand({
      TableName: "OurSpace_Users",
      Key: { email: { S: recipientEmail } },
    }));

    const pushSub = recipientData.Item?.push_subscription?.S;
    if (!pushSub) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: "NO_PUSH_TOKEN", message: "Recipient has no push token — in-app notification only." }),
      };
    }

    await webpush.sendNotification(
      JSON.parse(pushSub),
      JSON.stringify({
        title: `📞 ${callerName} is calling...`,
        body: "Tap to answer on OurSpace 2.0",
        icon: "/icon-192.png",
        url: `https://our-space-vibes.base44.app/VideoCall?with=${callerId}`,
        callId,
      })
    );

    // ── Step 4: Update ledger to "ringing" ────────────────────────────────
    await dynamo.send(new PutItemCommand({
      TableName: LEDGER_TABLE,
      Item: {
        callId:    { S: callId },
        status:    { S: "ringing" },
        timestamp: { N: String(Date.now()) },
        ttl:       { N: String(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30) },
      },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "RINGING", callId, message: "Push sent. Call is ringing." }),
    };

  } catch (err) {
    console.error("[Lambda] initiateCall error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error.", detail: err.message }),
    };
  }
};
