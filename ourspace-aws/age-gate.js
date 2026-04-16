// OurSpace 2.0 — Age Gate & Parental Consent Logic
// ASA (Age-Appropriate Design Code) / COPPA Compliant

// ── Age Gate Hook ─────────────────────────────────────────────────────────────
export function checkAgeGate(userProfile) {
  const age = userProfile?.age || null;
  const consentStatus = userProfile?.consent_status || "pending";
  const privacyLevel = userProfile?.privacy_level || "public";

  // If under 18: enforce Friends Only + require parental consent
  if (age !== null && age < 18) {
    return {
      isMinor: true,
      enforcedPrivacy: "friends_only",
      requiresConsent: consentStatus !== "approved",
      canMakeCalls: consentStatus === "approved" && privacyLevel === "friends_only",
      canPostPublicly: false,
      canReceiveDMs: consentStatus === "approved",
      message: consentStatus !== "approved"
        ? "A parent or guardian must approve your account before you can call or message."
        : "Your account is set to Friends Only for your safety.",
    };
  }

  return {
    isMinor: false,
    enforcedPrivacy: privacyLevel,
    requiresConsent: false,
    canMakeCalls: true,
    canPostPublicly: true,
    canReceiveDMs: true,
    message: null,
  };
}

// ── Age Gate UI Component (React) ────────────────────────────────────────────
import React from "react";

export function AgeGateBanner({ userProfile, onRequestConsent }) {
  const gate = checkAgeGate(userProfile);
  if (!gate.isMinor || !gate.requiresConsent) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #1e1040, #0d0d1a)",
      border: "1px solid #c084fc",
      borderRadius: 14,
      padding: "16px 20px",
      margin: "12px 0",
      color: "#f0f0f0",
      fontSize: 14,
      lineHeight: 1.6,
    }}>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
        🔒 Parental Approval Required
      </div>
      <div style={{ color: "#94a3b8", marginBottom: 14 }}>
        {gate.message}
      </div>
      <button
        onClick={onRequestConsent}
        style={{
          background: "linear-gradient(135deg, #c084fc, #22d3ee)",
          border: "none",
          borderRadius: 10,
          padding: "10px 20px",
          color: "#000",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        📧 Send Parent Approval Request
      </button>
    </div>
  );
}

// ── Parental Consent Request ──────────────────────────────────────────────────
export async function sendParentalConsentRequest(childEmail, parentEmail) {
  const response = await fetch("https://api.ourspace.com/consent/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ childEmail, parentEmail }),
  });
  return response.json();
}

// ── Report Call Feature (FCC/I-VoIP Compliance) ───────────────────────────────
export async function reportCall(callId, reporterEmail, reason) {
  const response = await fetch("https://api.ourspace.com/calls/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callId,
      reporterEmail,
      reason,
      timestamp: new Date().toISOString(),
    }),
  });
  return response.json();
}
