import { Resend } from "resend";
import { siteUrl } from "@/lib/env";

/**
 * E-mail via Resend. All sends are best-effort: if Resend isn't configured or a
 * send fails, callers continue normally (the DB write already succeeded).
 * NOTE: the FROM domain (everlooms.app) must be verified in Resend for delivery.
 */

const FROM =
  process.env.EMAIL_FROM ||
  process.env.RESEND_FROM_EMAIL ||
  "Everlooms <hallo@everlooms.app>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let client: Resend | null = null;
function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY ontbreekt");
  client ??= new Resend(key);
  return client;
}

function shell(
  heading: string,
  bodyHtml: string,
  cta?: { label: string; url: string },
): string {
  const button = cta
    ? `<a href="${cta.url}" style="display:inline-block;background:#56714e;color:#f7f4ee;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;padding:12px 26px;border-radius:999px;margin-top:8px">${cta.label}</a>`
    : "";
  return `
  <div style="background:#f7f4ee;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#33332c">
    <div style="max-width:520px;margin:0 auto;background:#fdfbf6;border:1px solid #e6ddca;border-radius:18px;padding:36px 32px">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3c4b36;font-weight:bold">Everlooms</div>
      <div style="height:1px;background:#e6ddca;margin:20px 0"></div>
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#3c4b36;margin:0 0 16px">${heading}</h1>
      <div style="font-size:15px;line-height:1.65;color:#4a4a42">${bodyHtml}</div>
      ${button}
    </div>
    <div style="max-width:520px;margin:16px auto 0;text-align:center;font-size:12px;color:#6f6a5c">
      Everlooms — Jouw verhaal. Voor altijd dichtbij.
    </div>
  </div>`;
}

async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<{ ok: boolean }> {
  if (!isEmailConfigured()) return { ok: false };
  try {
    await resend().emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    return { ok: true };
  } catch (e) {
    console.error("email send failed:", e);
    return { ok: false };
  }
}

/** Invitation to a family member to join a legacy. */
export async function sendInviteEmail(opts: {
  to: string;
  legacyName: string;
  roleLabel: string;
}): Promise<void> {
  const url = `${siteUrl()}/login`;
  const body = `
    <p>Je bent uitgenodigd om de nalatenschap van <strong>${opts.legacyName}</strong> te bezoeken op Everlooms.</p>
    <p>Jouw rol: <strong>${opts.roleLabel}</strong>.</p>
    <p>Log in met <strong>dit e-mailadres</strong> — dan krijg je automatisch toegang. Je hebt geen wachtwoord nodig; we sturen je een veilige inloglink.</p>`;
  await send({
    to: opts.to,
    subject: `Je bent uitgenodigd voor ${opts.legacyName} op Everlooms`,
    html: shell("Je bent uitgenodigd", body, { label: "Open Everlooms", url }),
  });
}

/** Internal notification when an uitvaartondernemer requests a partnership. */
export async function sendLeadNotification(opts: {
  name: string;
  email: string;
  organization?: string | null;
  phone?: string | null;
  message?: string | null;
}): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL || "partners@everlooms.app";
  const body = `
    <p>Er is een nieuwe partner-aanvraag binnengekomen:</p>
    <p>
      <strong>Naam:</strong> ${opts.name}<br/>
      <strong>Organisatie:</strong> ${opts.organization ?? "—"}<br/>
      <strong>E-mail:</strong> ${opts.email}<br/>
      <strong>Telefoon:</strong> ${opts.phone ?? "—"}
    </p>
    <p><strong>Bericht:</strong><br/>${opts.message ?? "—"}</p>`;
  await send({
    to,
    subject: `Nieuwe uitvaart-partner: ${opts.organization || opts.name}`,
    html: shell("Nieuwe partner-aanvraag", body),
  });
}
