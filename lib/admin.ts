import { User } from 'firebase/auth';

// Admin email list configured via environment variable or default admin emails
const ADMIN_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  'rochekollie@gmail.com,kollierb@gmail.com,roche@rochekollie.com,admin@rochekollie.com'
)
  .toLowerCase()
  .split(',')
  .map((e) => e.trim());

/**
 * Checks whether the given user has administrative privileges.
 * Matches user's email against configured admin emails or custom roles.
 */
export function checkIsAdmin(user: User | null, customRole?: string): boolean {
  if (!user || !user.email) {
    return false;
  }

  if (customRole === 'admin') {
    return true;
  }

  const userEmail = user.email.toLowerCase();

  // Explicit check against admin list
  if (ADMIN_EMAILS.includes(userEmail)) {
    return true;
  }

  // Developer convenience check for Roche's personal accounts
  if (userEmail.includes('rochekollie') || userEmail.startsWith('kollierb')) {
    return true;
  }

  return false;
}
