import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Create a Supabase client for API routes with auth from request headers
 */
export function createApiClient(request: NextRequest) {
  // Get Authorization header from request
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  });

  return client;
}

