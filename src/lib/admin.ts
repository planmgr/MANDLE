const ADMIN_EMAILS = ["planmgr@gmail.com", "admin@mandle.kr"];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
