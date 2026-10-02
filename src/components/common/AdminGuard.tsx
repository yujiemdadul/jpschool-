import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert } from 'lucide-react';

export const SPECIFIC_ADMIN_EMAIL = 'emdadulff12@gmail.com';
export const ALLOWED_ADMIN_EMAILS = [
  SPECIFIC_ADMIN_EMAIL,
  'gy755803@gmail.com'
];

/**
 * Checks if the given user profile possesses verified admin privileges
 * matching the required administrative email (emdadulff12@gmail.com).
 */
export const checkIsSpecificAdmin = (userProfile: { email?: string } | null | undefined): boolean => {
  if (!userProfile || !userProfile.email) return false;
  const cleanEmail = userProfile.email.toLowerCase().trim();
  return ALLOWED_ADMIN_EMAILS.includes(cleanEmail);
};

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showAccessDeniedMessage?: boolean;
}

/**
 * Component wrapper that protects admin routes and administrative controls (upload, delete, edit).
 * Verifies that the userProfile exists and contains the required admin email (emdadulff12@gmail.com)
 * before rendering protected admin UI.
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback = null,
  showAccessDeniedMessage = false
}) => {
  const { userProfile, isAdmin } = useAuth();
  const isAuthorizedAdmin = Boolean(isAdmin && checkIsSpecificAdmin(userProfile));

  if (!isAuthorizedAdmin) {
    if (showAccessDeniedMessage) {
      return (
        <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center max-w-md mx-auto my-6 space-y-3 animate-in fade-in duration-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-xs">
            <Lock size={22} />
          </div>
          <h4 className="text-base font-black text-rose-900 dark:text-rose-200">
            এডমিন অনুমতি আবশ্যক
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
            শুধুমাত্র অনুমোদিত এডমিন (<strong>{SPECIFIC_ADMIN_EMAIL}</strong>) ফাইল আপলোড, এডিট অথবা ডিলিট করতে পারবেন।
          </p>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
