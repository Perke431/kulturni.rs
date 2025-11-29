import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';
import { createAdminClient } from '@/lib/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create a client for sign in
    const signInClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    const { data, error } = await signInClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Always use admin client to bypass RLS recursion issue
    // If admin client creation fails, we'll get a clear error
    let profile, profileError;
    
    try {
      const adminClient = createAdminClient();
      const result = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      profile = result.data;
      profileError = result.error;
      
      // Debug logging
      console.log('Admin client query - User ID:', data.user.id, 'Profile:', profile, 'Error:', profileError);
    } catch (adminError: any) {
      // Admin client creation failed - likely missing SUPABASE_SERVICE_ROLE_KEY
      console.error('Admin client creation failed:', adminError.message);
      
      // Return a helpful error message
      await signInClient.auth.signOut();
      return NextResponse.json(
        { 
          error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required for admin authentication. Please set this environment variable.',
          details: process.env.NODE_ENV === 'development' ? adminError.message : undefined
        },
        { status: 500 }
      );
    }

    // If profile doesn't exist, create one with 'user' role
    if (profileError && (profileError.code === 'PGRST116' || profileError.message?.includes('No rows'))) {
      // Try to create profile using admin client, fall back to authenticated client
      let insertError;
      try {
        const adminClient = createAdminClient();
        const { error } = await adminClient
          .from('profiles')
          .insert({
            id: data.user.id,
            role: 'user',
          });
        insertError = error;
      } catch {
        // If admin client fails, try with authenticated client
        const { error } = await signInClient
          .from('profiles')
          .insert({
            id: data.user.id,
            role: 'user',
          });
        insertError = error;
      }

      if (insertError) {
        await signInClient.auth.signOut();
        return NextResponse.json(
          { error: 'Failed to create user profile. Please contact support.' },
          { status: 500 }
        );
      }

      await signInClient.auth.signOut();
      return NextResponse.json(
        { 
          error: 'Your account has been created, but admin privileges are required. Please contact an administrator to grant you admin access.',
          needsAdminAccess: true 
        },
        { status: 403 }
      );
    }

    if (!profile || profile.role !== 'admin') {
      // Sign out the user if they're not an admin
      await signInClient.auth.signOut();
      return NextResponse.json(
        { 
          error: 'Access denied. Admin privileges required. Your current role is: ' + (profile?.role || 'not set') + '. Please contact an administrator.',
          currentRole: profile?.role || null,
          userId: data.user.id,
          userEmail: data.user.email,
          profileError: profileError ? {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          } : null
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during login',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

