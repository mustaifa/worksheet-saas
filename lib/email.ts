const FROM = process.env.EMAIL_FROM || "Practice Sheet <onboarding@resend.dev>";

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send:", subject, "to", to);
    return { skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error("Email send failed:", await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { ok: false };
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function wrapper(bodyHtml: string) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      ${bodyHtml}
      <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Practice Sheet — worksheets for grades 1–12</p>
    </div>
  `;
}

export async function sendWelcomeEmail(to: string, name: string | null, trialDays: number) {
  const html = wrapper(`
    <h2 style="color: #0f172a;">Welcome${name ? `, ${name}` : ""}!</h2>
    <p style="color: #334155; line-height: 1.6;">
      Your ${trialDays}-day free trial has started — no card needed. Generate Math, English,
      and Science worksheets for any grade from 1–12, print them, or download as PDF.
    </p>
    <a href="${APP_URL}/dashboard" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
      Go to your dashboard
    </a>
  `);
  return sendEmail(to, "Welcome to Practice Sheet — your trial has started", html);
}

export async function sendTrialReminderEmail(to: string, name: string | null, daysLeft: number) {
  const html = wrapper(`
    <h2 style="color: #0f172a;">${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your trial</h2>
    <p style="color: #334155; line-height: 1.6;">
      Hi${name ? ` ${name}` : ""}, just a heads up — your free trial ends soon. Subscribe now
      to keep generating worksheets without interruption.
    </p>
    <a href="${APP_URL}/pricing" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
      See plans
    </a>
  `);
  return sendEmail(to, `Your Practice Sheet trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`, html);
}

export async function sendTrialEndedEmail(to: string, name: string | null) {
  const html = wrapper(`
    <h2 style="color: #0f172a;">Your free trial has ended</h2>
    <p style="color: #334155; line-height: 1.6;">
      Hi${name ? ` ${name}` : ""}, your trial period is over. Subscribe anytime to pick up
      right where you left off.
    </p>
    <a href="${APP_URL}/pricing" style="display:inline-block; background:#0f172a; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; margin-top:12px;">
      Subscribe now
    </a>
  `);
  return sendEmail(to, "Your Practice Sheet trial has ended", html);
}

export async function sendContactFormEmail(fromName: string, fromEmail: string, message: string) {
  const to = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_FROM || "";
  const html = wrapper(`
    <h2 style="color: #0f172a;">New contact form message</h2>
    <p style="color: #334155;"><strong>From:</strong> ${fromName} (${fromEmail})</p>
    <p style="color: #334155; white-space: pre-wrap; border-left: 3px solid #e2e8f0; padding-left: 12px; margin-top: 12px;">${message}</p>
  `);
  return sendEmail(to, `Contact form: ${fromName}`, html);
}
