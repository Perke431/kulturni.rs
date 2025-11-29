import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/utils/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow access to login page without authentication
  // This will be handled by individual pages
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

