'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import AdminDashboard from '@/components/admin/dashboard';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient();
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Check if user is admin using API route (bypasses RLS recursion)
      try {
        const response = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        if (!data.isAdmin) {
          await supabase.auth.signOut();
          router.push('/admin/login');
          return;
        }

        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        await supabase.auth.signOut();
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminDashboard />;
}

