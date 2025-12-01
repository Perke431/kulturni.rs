import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/supabase/api-client';
import { createAdminClient } from '@/lib/supabase/server';

// GET - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createApiClient(request);

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to get profile (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// PUT - Update profile (first name, last name)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('PUT /api/settings - Auth header:', authHeader ? 'Present' : 'Missing');
    
    const supabase = createApiClient(request);

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('PUT /api/settings - User:', user?.id, 'Error:', authError?.message);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to check role and update (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { first_name, last_name } = body;

    // Update profile
    const { error: updateError } = await adminClient
      .from('profiles')
      .update({
        first_name: first_name || null,
        last_name: last_name || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient(request);

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to check role (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { new_password } = body;

    if (!new_password || new_password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Update password using admin client
    const { error: passwordError } = await adminClient.auth.admin.updateUserById(
      user.id,
      { password: new_password }
    );

    if (passwordError) {
      console.error('Password update error:', passwordError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
