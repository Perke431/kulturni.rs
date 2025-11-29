import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * One-time setup route to create the first admin user
 * This uses the service role key, so it should be protected or removed after setup
 * 
 * Usage: POST /api/auth/setup-admin
 * Body: { email: "admin@example.com", password: "securepassword" }
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow this in development or with additional security checks
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is disabled in production' },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Create user in auth
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      return NextResponse.json(
        { error: `Failed to create user: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    // Create profile with admin role
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email || email,
        role: 'admin',
      });

    if (profileError) {
      // Try to delete the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `Failed to create profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      userId: authData.user.id,
      email: authData.user.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}

