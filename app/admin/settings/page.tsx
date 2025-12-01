'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ProfileData {
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Check if admin
    try {
      const response = await fetch('/api/auth/check', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!data.isAdmin) {
        router.push('/admin/login');
        return;
      }

      await loadProfile(session.access_token);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    }
  };

  const loadProfile = async (token: string) => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await loadProfile(session.access_token);
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-primary hover:text-primary/80 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="h1 text-primary mb-2">Settings</h1>
          <p className="text-text/70">Manage your profile and account settings</p>
        </div>

        <div className="space-y-8">
          <ProfileSection
            profile={profile}
            onUpdate={refreshProfile}
          />
          
          <PasswordSection />
        </div>
      </div>
    </div>
  );
}

function ProfileSection({
  profile,
  onUpdate,
}: {
  profile: ProfileData | null;
  onUpdate: () => void;
}) {
  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [lastName, setLastName] = useState(profile?.last_name ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? '');
      setLastName(profile.last_name ?? '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setMessage({ type: 'error', text: 'Not authenticated' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      onUpdate();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg p-6">
      <h2 className="h4 text-primary mb-6">Profile Information</h2>
      
      {profile && (
        <div className="mb-6 pb-6 border-b border-white-20">
          <label className="block text-sm font-medium text-text/70 mb-1">Email</label>
          <p className="text-text">{profile.email}</p>
        </div>
      )}

      {message && (
        <div
          className={`p-3 rounded-md mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500 text-green-300'
              : 'bg-red-500/20 border border-red-500 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text/40"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordSection() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setMessage({ type: 'error', text: 'Not authenticated' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg p-6">
      <h2 className="h4 text-primary mb-6">Change Password</h2>

      {message && (
        <div
          className={`p-3 rounded-md mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500 text-green-300'
              : 'bg-red-500/20 border border-red-500 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-text">New Password</label>
          <div className="relative">
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text/40 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 hover:text-text transition-colors"
            >
              {showPasswords ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Confirm New Password</label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={6}
            className="w-full px-4 py-3 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-text/40"
          />
        </div>

        <p className="text-sm text-text/60">Password must be at least 6 characters long.</p>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="px-6 py-3 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
