# Privacy Policy — STUN/TURN & Geolocation Disclosure

## Video & Voice Calls — IP Address Processing

When you use OurSpace 2.0's video or voice calling features, your device establishes a peer-to-peer connection using the **WebRTC protocol**. To facilitate this connection, OurSpace 2.0 uses the following infrastructure:

### STUN Servers
STUN (Session Traversal Utilities for NAT) servers are used to discover your device's public IP address. This is a standard technical step required to establish any peer-to-peer connection. OurSpace 2.0 uses both public STUN servers (operated by Google) and private STUN servers hosted on Amazon Web Services (AWS).

### TURN Servers
In cases where a direct peer-to-peer connection cannot be established (common on restrictive mobile or corporate networks), your call traffic is relayed through a **TURN (Traversal Using Relays around NAT) server** hosted by OurSpace 2.0 on AWS infrastructure. This ensures reliable connectivity.

### What This Means for Your Privacy

**IP Address Processing:**
Your IP address — which may reveal your approximate geographic location — is processed by our STUN and TURN servers **solely for the purpose of establishing your call connection**. Under applicable privacy regulations including the California Consumer Privacy Act (CCPA) and emerging state Age-Appropriate Design Code (ASA) laws, IP addresses used in connection with geolocation are classified as **Sensitive Personal Information / Sensitive Geolocation Data**.

**OurSpace 2.0 commits to the following:**
- Your IP address is used **exclusively** to facilitate the technical WebRTC connection.
- Your IP address is **not sold**, shared with advertisers, or used for behavioral profiling.
- TURN relay sessions are **not recorded or stored** beyond the duration of your call.
- Call **metadata** (call ID, timestamp, duration, participant identifiers) is logged for **FCC/I-VoIP regulatory compliance** only and is stored securely in Amazon DynamoDB with automatic deletion after 30 days.
- Call **content** (audio and video streams) is **never recorded, intercepted, or stored** by OurSpace 2.0.

### Minors (Under 18)
If your account indicates you are under 18, WebRTC calling features are restricted to confirmed friends only and require verified parental consent before activation. This restriction is enforced server-side.

### Your Rights
You may request deletion of your call metadata at any time by contacting us at **privacy@ourspace.com**. Requests will be fulfilled within 30 days per CCPA/GDPR requirements.

---
*Last updated: April 2026 | OurSpace 2.0 | Indianapolis, Indiana*
