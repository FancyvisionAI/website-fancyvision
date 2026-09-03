import nodemailer from "nodemailer";

// Ajoute temporairement CONTACT_TEST_NOTIFICATION_EMAIL en copie des
// destinataires habituels (sans les remplacer), pour vérifier la
// réception réelle des notifications. Sans effet si la variable est
// absente/vide, ou si elle correspond déjà à un destinataire existant.
function resolveRecipients(primary: string): string {
  const addresses = primary
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const testEmail = process.env.CONTACT_TEST_NOTIFICATION_EMAIL?.trim();
  if (
    testEmail &&
    !addresses.some(
      (address) => address.toLowerCase() === testEmail.toLowerCase(),
    )
  ) {
    addresses.push(testEmail);
  }
  return addresses.join(", ");
}

export async function notifyTeam(subject: string, body: string) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  )
    return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: resolveRecipients(
      process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER,
    ),
    subject,
    text: body,
  });
}
