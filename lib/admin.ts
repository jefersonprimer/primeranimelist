/**
 * Admin actions (create/update anime & manga) are allowed only for the email
 * set in ADMIN_EMAIL (e.g. in .env.local). Never commit real passwords.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) return false;
  return email.trim().toLowerCase() === configured;
}
