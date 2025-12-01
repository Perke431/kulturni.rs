import { createServerClient } from '@/lib/supabase/server';

/**
 * Check if the current user is an admin
 * Use this in Server Components, Server Actions, and API routes
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return user;
}


