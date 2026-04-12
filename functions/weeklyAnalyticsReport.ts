import { createClientFromRequest } from "@base44/sdk";

export default async function handler(req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("google_analytics");
    const { accessToken: gscToken } = await base44.asServiceRole.connectors.getConnection("google_search_console");

    const measurementId = "G-HEWR0ZB5G8";
    const appUrl = "https://legacy-circle.base44.app";
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    // Find the GA4 property by measurement ID
    let propertyId = null;
    const accountsRes = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=50",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountsData = await accountsRes.json();

    if (accountsData.accountSummaries) {
      for (const account of accountsData.accountSummaries) {
        for (const prop of (account.propertySummaries || [])) {
          // Try to match by stream
          const streamsRes = await fetch(
            `https://analyticsadmin.googleapis.com/v1beta/${prop.property}/dataStreams`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const streamsData = await streamsRes.json();
          for (const stream of (streamsData.dataStreams || [])) {
            if (stream.webStreamData?.measurementId === measurementId) {
              propertyId = prop.property.replace("properties/", "");
            }
          }
        }
      }
    }

    let gaReport = null;
    if (propertyId) {
      const gaRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            dateRanges: [{ startDate: fmt(weekAgo), endDate: fmt(today) }],
            metrics: [
              { name: "activeUsers" },
              { name: "sessions" },
              { name: "screenPageViews" },
              { name: "bounceRate" },
              { name: "averageSessionDuration" },
            ],
            dimensions: [{ name: "pagePath" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: 10,
          }),
        }
      );
      gaReport = await gaRes.json();
    }

    // Search Console data
    let gscData = null;
    const gscRes = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(appUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${gscToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: fmt(weekAgo),
          endDate: fmt(today),
          dimensions: ["query"],
          rowLimit: 10,
        }),
      }
    );
    gscData = await gscRes.json();

    // Build email report
    let gaSection = "⚠️ Analytics data not yet available (property still warming up — check back next week)";
    if (gaReport?.rows?.length > 0) {
      const totals = gaReport.rows.reduce((acc: any, row: any) => {
        acc.users += parseInt(row.metricValues[0].value || 0);
        acc.sessions += parseInt(row.metricValues[1].value || 0);
        acc.pageviews += parseInt(row.metricValues[2].value || 0);
        return acc;
      }, { users: 0, sessions: 0, pageviews: 0 });

      const topPages = gaReport.rows.slice(0, 5).map((row: any) =>
        `  • ${row.dimensionValues[0].value} — ${row.metricValues[1].value} sessions`
      ).join("\n");

      gaSection = `📊 TRAFFIC THIS WEEK
• Active Users: ${totals.users.toLocaleString()}
• Sessions: ${totals.sessions.toLocaleString()}
• Page Views: ${totals.pageviews.toLocaleString()}

🔝 TOP PAGES
${topPages}`;
    }

    let gscSection = "⚠️ Search Console data not yet available (site verification may be pending)";
    if (gscData?.rows?.length > 0) {
      const topKeywords = gscData.rows.slice(0, 5).map((row: any) =>
        `  • "${row.keys[0]}" — ${row.clicks} clicks, ${row.impressions} impressions`
      ).join("\n");
      gscSection = `🔍 TOP SEARCH KEYWORDS
${topKeywords}`;
    }

    const emailBody = `Hey Dixson! Here's your weekly app performance report 👇

${gaSection}

${gscSection}

📅 Report period: ${fmt(weekAgo)} → ${fmt(today)}
🔗 Legacy Circle: https://legacy-circle.base44.app
🔗 OurSpace 2.0: https://legacy-circle.base44.app/Home

Keep pushing — talk soon!`;

    // Send via Gmail
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection("gmail");
    const emailRaw = btoa(
      `To: ddortese@gmail.com\r\nFrom: ddortese@gmail.com\r\nSubject: 📊 Weekly App Report — Legacy Circle & OurSpace 2.0\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${emailBody}`
    ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${gmailToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: emailRaw }),
    });

    return Response.json({ success: true, propertyFound: !!propertyId, message: "Weekly report sent to ddortese@gmail.com" });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
