'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/client';

interface UserData {
  email: string;
  first_name: string | null;
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch profile to get first_name
        try {
          const response = await fetch('/api/settings', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData({
              email: data.email,
              first_name: data.first_name,
            });
          } else {
            // Fallback to just email
            setUserData({
              email: session.user.email || '',
              first_name: null,
            });
          }
        } catch {
          setUserData({
            email: session.user.email || '',
            first_name: null,
          });
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="h1 text-primary mb-2">Admin Dashboard</h1>
            <p className="text-text/70">
              Welcome back, {userData?.first_name || userData?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/20 border border-red-500 rounded-md text-red-300 hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Blogs"
            description="Manage blog posts"
            href="/admin/blogs"
          />
          <DashboardCard
            title="Events"
            description="Manage events"
            href="/admin/events"
          />
          <DashboardCard
            title="Settings"
            description="Configure settings"
            href="/admin/settings"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg p-6 hover:bg-white-30 transition-colors"
    >
      <h3 className="h4 text-primary mb-2">{title}</h3>
      <p className="text-text/70">{description}</p>
    </Link>
  );
}

