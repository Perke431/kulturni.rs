import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';
import { createAdminClient } from '@/lib/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { isAdmin: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    // Create a client to get the user from the token
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error: userError } = await client.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { isAdmin: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Use admin client to check profile (bypasses RLS)
    try {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return NextResponse.json({
        isAdmin: profile?.role === 'admin',
        role: profile?.role || null,
        userId: user.id,
      });
    } catch (adminError: any) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required',
          details: process.env.NODE_ENV === 'development' ? adminError.message : undefined
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { isAdmin: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}

