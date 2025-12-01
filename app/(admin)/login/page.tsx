'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Check if user is admin using API route (bypasses RLS recursion)
        try {
          const response = await fetch('/api/auth/check', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          const data = await response.json();

          if (data.isAdmin) {
            router.push('/admin');
            return;
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Set the session in the client-side Supabase client
      if (data.session) {
        const supabase = createSupabaseClient();
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        if (sessionError) {
          setError('Failed to set session: ' + sessionError.message);
          setLoading(false);
          return;
        }
      }

      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-white-20 backdrop-blur-sm rounded-lg p-8 border border-white-20">
          <h1 className="h2 text-center mb-8 text-primary">Admin Login</h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-md p-3 text-sm text-red-300 space-y-2">
                <p className="font-semibold">{error}</p>
                {error.includes('Admin privileges required') && (
                  <div className="mt-3 pt-3 border-t border-red-500/30">
                    <p className="text-xs text-red-200/80 mb-2">
                      To set up an admin user:
                    </p>
                    <ol className="text-xs text-red-200/80 list-decimal list-inside space-y-1">
                      <li>Sign up or log in to Supabase Auth</li>
                      <li>Go to Supabase Dashboard → Authentication → Users</li>
                      <li>Find your user ID</li>
                      <li>Run this SQL in the SQL Editor:</li>
                    </ol>
                    <code className="block mt-2 p-2 bg-background/50 rounded text-xs text-red-200/90 overflow-x-auto">
                      UPDATE public.profiles
                      <br />
                      SET role = 'admin'
                      <br />
                      WHERE id = 'your-user-id-here';
                    </code>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background font-bold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
