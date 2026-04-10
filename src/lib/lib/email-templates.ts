export type LeadData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  employeeCount: string;
  industry: string;
  currentTools: string;
  painPoints: string[];
  source: string;
  chatHistory?: string;
  consentTimestamp: string;
};

export function buildAutoResponseEmail({
  firstName,
  unsubUrl,
  privacyUrl,
  termsUrl,
  physicalAddress,
  siteUrl,
  ownerEmail,
}: {
  firstName: string;
  unsubUrl: string;
  privacyUrl: string;
  termsUrl: string;
  physicalAddress: string;
  siteUrl: string;
  ownerEmail: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>Your Free AI Audit is Being Reviewed — Organic AI Solutions</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;">
<tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

  <!-- Logo -->
  <tr>
    <td align="center" style="padding:32px 40px 20px;background:#ffffff;">
      <img src="${siteUrl}/logo.png" alt="Organic AI Solutions" width="200" style="display:block;max-width:200px;height:auto;margin:0 auto;" />
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;font-style:italic;">Grow Organically. Scale Intelligently.</p>
    </td>
  </tr>

  <!-- Orange header bar -->
  <tr>
    <td style="background:#E8420A;padding:28px 40px;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;line-height:1.3;">Your AI Audit is Being Reviewed</h1>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px 40px;background:#ffffff;">
      <p style="color:#2B2B2B;font-size:16px;margin:0 0 20px;line-height:1.7;font-weight:600;">Hi ${firstName},</p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 28px;">
        Thank you for completing your AI Audit. Our team is reviewing your responses and building your personalized recommendations. Expect to hear from us within 24 hours.
      </p>

      <!-- What to Expect -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff7ed;border-radius:8px;border-left:4px solid #E8420A;margin-bottom:28px;">
        <tr><td style="padding:20px 24px;">
          <p style="color:#2B2B2B;font-size:15px;font-weight:700;margin:0 0 14px;">What to Expect</p>
          <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
            <tr><td style="padding:5px 0;color:#374151;font-size:14px;line-height:1.6;"><span style="color:#E8420A;font-weight:700;margin-right:8px;">&#10003;</span>A dedicated AI specialist assigned to your account</td></tr>
            <tr><td style="padding:5px 0;color:#374151;font-size:14px;line-height:1.6;"><span style="color:#E8420A;font-weight:700;margin-right:8px;">&#10003;</span>Custom AI solutions built for your specific business</td></tr>
            <tr><td style="padding:5px 0;color:#374151;font-size:14px;line-height:1.6;"><span style="color:#E8420A;font-weight:700;margin-right:8px;">&#10003;</span>Ongoing support and optimization as your business grows</td></tr>
          </table>
        </td></tr>
      </table>

      <!-- Core Services -->
      <p style="color:#2B2B2B;font-size:15px;font-weight:700;margin:0 0 14px;">Our Core Services</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="49%" style="padding:0 1% 10px 0;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">AI Automation</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Automate repetitive tasks and free your team for growth</div>
            </div>
          </td>
          <td width="49%" style="padding:0 0 10px 1%;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">Workflow Optimization</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Streamline operations for maximum efficiency</div>
            </div>
          </td>
        </tr>
        <tr>
          <td width="49%" style="padding:0 1% 10px 0;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">AI Consulting</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Strategic guidance on AI adoption and ROI</div>
            </div>
          </td>
          <td width="49%" style="padding:0 0 10px 1%;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">Data Insights</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Turn data into actionable business intelligence</div>
            </div>
          </td>
        </tr>
        <tr>
          <td width="49%" style="padding:0 1% 0 0;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">Process Mapping</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Identify and eliminate workflow inefficiencies</div>
            </div>
          </td>
          <td width="49%" style="padding:0 0 0 1%;vertical-align:top;">
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 14px;">
              <div style="color:#E8420A;font-size:13px;font-weight:700;margin-bottom:4px;">AI Training</div>
              <div style="color:#6b7280;font-size:12px;line-height:1.5;">Empower your team with practical AI skills</div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Signature -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;">
        <tr><td>
          <p style="color:#2B2B2B;font-size:15px;margin:0 0 4px;font-weight:600;">Terrence Crawford</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 6px;">Co-Founder &amp; CEO, Organic AI Solutions</p>
          <a href="mailto:${ownerEmail}" style="color:#E8420A;font-size:13px;text-decoration:none;">${ownerEmail}</a>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Legal footer -->
  <tr>
    <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:11px;line-height:1.7;margin:0 0 6px;text-align:center;">
        You are receiving this because you requested a Free AI Audit at organicaisolutions.com
      </p>
      <p style="color:#9ca3af;font-size:11px;text-align:center;margin:0 0 8px;">${physicalAddress}</p>
      <p style="text-align:center;margin:0;">
        <a href="${unsubUrl}" style="color:#9ca3af;font-size:11px;">Unsubscribe</a>
        &nbsp;&bull;&nbsp;
        <a href="${privacyUrl}" style="color:#9ca3af;font-size:11px;">Privacy Policy</a>
        &nbsp;&bull;&nbsp;
        <a href="${termsUrl}" style="color:#9ca3af;font-size:11px;">Terms of Service</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function buildInternalEmail({
  lead,
  ownerEmail,
}: {
  lead: LeadData;
  ownerEmail: string;
}): string {
  const painPointsList = lead.painPoints.length
    ? lead.painPoints.map((p) => `<li style="margin-bottom:4px;color:#374151;font-size:14px;">&#8226; ${p}</li>`).join("")
    : `<li style="color:#374151;font-size:14px;">None selected</li>`;

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  });

  const rows = [
    ["Name", `${lead.firstName} ${lead.lastName}`],
    ["Email", `<a href="mailto:${lead.email}" style="color:#E8420A;">${lead.email}</a>`],
    ["Phone", lead.phone || "Not provided"],
    ["Business", lead.businessName],
    ["Business Type", lead.businessType || "—"],
    ["Employees", lead.employeeCount || "—"],
    ["Industry", lead.industry || "—"],
    ["Current Tools", lead.currentTools || "—"],
    ["Source", lead.source === "chatbot" ? "AI Chatbot" : "Free AI Audit Form"],
    ["Submitted", `${submittedAt} CT`],
  ];

  const tableRows = rows
    .map(
      ([label, value], i) =>
        `<tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
      <td style="padding:11px 14px;color:#6b7280;font-size:13px;width:140px;border:1px solid #e5e7eb;font-weight:600;">${label}</td>
      <td style="padding:11px 14px;color:#111827;font-size:14px;border:1px solid #e5e7eb;">${value}</td>
    </tr>`
    )
    .join("");

  const chatSection =
    lead.source === "chatbot" && lead.chatHistory
      ? `<div style="margin-top:20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
          <p style="color:#2B2B2B;font-size:14px;font-weight:700;margin:0 0 10px;">Chat History</p>
          <pre style="color:#374151;font-size:12px;white-space:pre-wrap;margin:0;line-height:1.6;">${lead.chatHistory}</pre>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="color-scheme" content="light"/>
<title>New Lead — ${lead.businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;">
<tr><td align="center" style="padding:32px 16px;">
<table width="680" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

  <!-- Header -->
  <tr>
    <td style="background:#E8420A;padding:20px 28px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">New Lead — ${lead.source === "chatbot" ? "AI Chatbot" : "Free AI Audit"}</h1>
      <p style="color:rgba(255,255,255,0.88);margin:5px 0 0;font-size:13px;">&#9200; Follow up within 24 hours for best results</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:24px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;">
        ${tableRows}
      </table>

      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:16px;">
        <p style="margin:0 0 10px;color:#2B2B2B;font-size:14px;font-weight:700;">Pain Points Identified</p>
        <ul style="margin:0;padding:0;list-style:none;">${painPointsList}</ul>
      </div>

      ${chatSection}

      <div style="border-left:4px solid #E8420A;padding:12px 16px;background:#fff7ed;border-radius:0 8px 8px 0;margin-top:20px;">
        <p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">Respond to: <a href="mailto:${lead.email}" style="color:#E8420A;">${lead.email}</a></p>
      </div>

      <p style="color:#9ca3af;font-size:11px;margin-top:20px;">Lead ID: ${lead.id} | Consent: ${lead.consentTimestamp}</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
  void ownerEmail;
}
