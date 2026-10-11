/**
 * Email Integration
 * Transactional email sending for enquiries.
 * Supports multiple providers via adapter pattern.
 */

const providers = {
  resend: async (config, emailData) => {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: emailData.toEmail || config.toEmail,
        replyTo: emailData.replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    return response.json();
  },

  sendgrid: async (config, emailData) => {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.toEmail || config.toEmail }],
            replyTo: { email: emailData.replyTo },
            subject: emailData.subject,
          },
        ],
        from: { email: config.fromEmail, name: config.fromName },
        content: [
          { type: "text/plain", value: emailData.text },
          { type: "text/html", value: emailData.html },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`SendGrid API error: ${response.status} - ${JSON.stringify(error)}`);
    }

    return { success: true };
  },

  nodemailer: async (config, emailData) => {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: emailData.toEmail || config.toEmail,
      replyTo: emailData.replyTo,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });

    return { messageId: info.messageId };
  },
};

export function getEmailProvider() {
  const provider = process.env.EMAIL_PROVIDER || "resend";
  return providers[provider] || providers.resend;
}

export function getEmailConfig() {
  const provider = process.env.EMAIL_PROVIDER || "resend";

  const baseConfig = {
    provider,
    fromEmail: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME || "Finocast Enquiries",
    toEmail: process.env.FINOCAST_ENQUIRY_EMAIL || "bhupal@finocast.com",
  };

  switch (provider) {
    case "resend":
      return { ...baseConfig, apiKey: process.env.RESEND_API_KEY };
    case "sendgrid":
      return { ...baseConfig, apiKey: process.env.SENDGRID_API_KEY };
    case "nodemailer":
      return {
        ...baseConfig,
        smtpHost: process.env.SMTP_HOST,
        smtpPort: parseInt(process.env.SMTP_PORT || "587"),
        smtpSecure: process.env.SMTP_SECURE === "true",
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
      };
    default:
      return { ...baseConfig, apiKey: process.env.RESEND_API_KEY };
  }
}

export function generateEnquiryEmail(data, type = "rfq") {
  const isRfq = type === "rfq";
  const label = isRfq ? "Request for Quote" : "Contact Form";

  const fields = [
    { label: "Full Name", value: data.fullName },
    { label: "Company", value: data.companyName || "Not provided" },
    { label: "Email", value: data.email },
    { label: "Telephone", value: data.telephone || "Not provided" },
  ];

  if (isRfq) {
    fields.push(
      { label: "Component/Application", value: data.componentDescription },
      { label: "Material/Alloy Grade", value: data.materialGrade || "Not specified" },
      { label: "Approximate Weight", value: data.approximateWeight || "Not specified" },
      { label: "Required Quantity", value: data.requiredQuantity || "Not specified" }
    );
  } else {
    fields.push({ label: "Subject", value: data.subject });
  }

  if (data.additionalRequirements) {
    fields.push({ label: isRfq ? "Additional Requirements" : "Message", value: data.additionalRequirements });
  }

  if (!isRfq && data.message) {
    fields.push({ label: "Message", value: data.message });
  }

  const rows = fields
    .map(
      (f) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E2DB; font-weight: 600; color: #171A1C; width: 200px;">${f.label}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #E5E2DB; color: #30363A;">${escapeHtml(f.value)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F2ED;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(23, 26, 28, 0.08);">
        <!-- Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: #171A1C; padding: 24px 32px;">
              <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 600; color: #F4F2ED;">New ${label}</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #8C949A;">Finocast Website Enquiry</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
          <tr>
            <td style="font-size: 16px; color: #30363A; line-height: 1.6;">
              <p>A new ${label.toLowerCase()} has been submitted through the Finocast website.</p>
            </td>
          </tr>
        </table>

        <!-- Details Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 32px 32px; border-collapse: collapse; border: 1px solid #E5E2DB; border-radius: 6px; overflow: hidden;">
          ${rows}
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 0 32px 32px;">
          <tr>
            <td style="font-size: 12px; color: #8C949A; line-height: 1.6;">
              <p style="margin: 0 0 8px;">This enquiry was submitted via the Finocast website at ${new Date().toISOString()}.</p>
              <p style="margin: 0;">Please respond directly to this email (Reply-To is set to the enquirer's address).</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
New ${label} - Finocast Website Enquiry

${fields.map((f) => `${f.label}: ${f.value}`).join("\n")}

---
Submitted: ${new Date().toISOString()}
Source: Finocast Website
Reply directly to this email to respond to the enquirer.
  `.trim();

  return { html, text };
}

export function generateConfirmationEmail(data, type = "rfq") {
  const isRfq = type === "rfq";
  const subject = isRfq ? "We've received your Request for Quote" : "We've received your message";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F2ED;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(23, 26, 28, 0.08);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background: #171A1C; padding: 24px 32px;">
              <h1 style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 600; color: #F4F2ED;">Thank You</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #8C949A;">Your ${isRfq ? "RFQ" : "message"} has been received</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 32px;">
          <tr>
            <td style="font-size: 16px; color: #30363A; line-height: 1.7;">
              <p>Dear ${escapeHtml(data.fullName)},</p>
              <p>Thank you for contacting Finocast. We have received your ${isRfq ? "Request for Quote" : "message"} and our technical team will review it.</p>
              <p>For urgent enquiries, please call us at <strong>${company.contact.phones[0].number}</strong>.</p>
              <p style="margin-top: 24px;">Best regards,<br>The Finocast Team</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F4F2ED; padding: 24px 32px;">
          <tr>
            <td style="font-size: 12px; color: #8C949A; text-align: center;">
              <p style="margin: 0;">Finocast Precision Investment Casting</p>
              <p style="margin: 4px 0 0;">${company.addresses.factory.street}, ${company.addresses.factory.area}, ${company.addresses.factory.city} - ${company.addresses.factory.postalCode}, ${company.addresses.factory.state}, India</p>
              <p style="margin: 4px 0 0;"><a href="https://finocast.com" style="color: #E38B50;">finocast.com</a> | <a href="mailto:info@finocast.com" style="color: #E38B50;">info@finocast.com</a> | <a href="mailto:bhupal@finocast.com" style="color: #E38B50;">bhupal@finocast.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Thank you for contacting Finocast.

Dear ${data.fullName},

We have received your ${isRfq ? "Request for Quote" : "message"} and our technical team will review it.

For urgent enquiries, please call us at ${company.contact.phones[0].number}.

Best regards,
The Finocast Team

---
Finocast Precision Investment Casting
${company.addresses.factory.street}, ${company.addresses.factory.area}, ${company.addresses.factory.city} - ${company.addresses.factory.postalCode}, ${company.addresses.factory.state}, India
finocast.com | info@finocast.com | bhupal@finocast.com
  `.trim();

  return { subject, html, text };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEnquiryEmail(data, type = "rfq") {
  const provider = getEmailProvider();
  const config = getEmailConfig();

  if (!config.fromEmail) {
    console.warn("Verified email sender is not configured. Enquiry saved without email notification.");
    return { success: false, reason: "Email sender not configured" };
  }

  if (!config.apiKey && config.provider !== "nodemailer") {
    console.warn("Email provider API key not configured. Enquiry logged but not sent.");
    return { success: false, reason: "Email provider not configured" };
  }

  if (config.provider === "nodemailer" && (!config.smtpHost || !config.smtpUser)) {
    console.warn("SMTP not configured. Enquiry logged but not sent.");
    return { success: false, reason: "SMTP not configured" };
  }

  const { html, text } = generateEnquiryEmail(data, type);
  const confirmation = generateConfirmationEmail(data, type);

  try {
    // Send to Finocast
    await provider(config, {
      replyTo: data.email,
      subject: `New ${type === "rfq" ? "RFQ" : "Contact"} from ${data.fullName} (${data.companyName || "No company"})`,
      html,
      text,
    });

    // Send confirmation to enquirer
    await provider(config, {
      replyTo: config.toEmail,
      toEmail: data.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
