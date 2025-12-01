import { createServerClient } from '@/lib/supabase/server';
import type { Blog, BlogInsert, BlogUpdate } from '@/lib/types/database.types';

/**
 * Get all blogs, ordered by date (newest first)
 */
export async function getAllBlogs() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return data as Blog[];
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(id: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Get blogs by related blog IDs
 */
export async function getBlogsByIds(ids: string[]) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .in('id', ids);

  if (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`);
  }

  return data as Blog[];
}

/**
 * Create a new blog (admin only - requires auth)
 */
export async function createBlog(blog: BlogInsert) {
  const supabase = await createServerClient();
  
  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized: User must be authenticated');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin role required');
  }

  const { data, error } = await supabase
    .from('blogs')
    .insert(blog)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Update a blog (admin only - requires auth)
 */
export async function updateBlog(id: string, updates: BlogUpdate) {
  const supabase = await createServerClient();
  
  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized: User must be authenticated');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin role required');
  }

  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Delete a blog (admin only - requires auth)
 */
export async function deleteBlog(id: string) {
  const supabase = await createServerClient();
  
  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized: User must be authenticated');
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin role required');
  }

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete blog: ${error.message}`);
  }

  return { success: true };
}


