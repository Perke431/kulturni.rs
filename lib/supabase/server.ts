import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server client for Server Components and Server Actions
// Note: For full auth support, you may want to use @supabase/ssr package
// or implement middleware to handle session cookies.
// For now, this works for public reads and admin operations via service role.
export const createServerClient = async () => {
  // Get authorization header from request if available
  // In API routes, you can pass the Authorization header
  // For Server Components, auth will work through RLS policies
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Admin client for server-side operations (bypasses RLS)
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
};

