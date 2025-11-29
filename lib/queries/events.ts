import { createServerClient } from '@/lib/supabase/server';
import type { Event, EventInsert, EventUpdate, BuyTicketLink } from '@/lib/types/database.types';

/**
 * Get all events, ordered by date (newest first)
 */
export async function getAllEvents() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data as Event[];
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data as Event;
}

/**
 * Get events by related event IDs
 */
export async function getEventsByIds(ids: string[]) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .in('id', ids);

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data as Event[];
}

/**
 * Get upcoming events (events with date >= today)
 */
export async function getUpcomingEvents() {
  const supabase = await createServerClient();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch upcoming events: ${error.message}`);
  }

  return data as Event[];
}

/**
 * Create a new event (admin only - requires auth)
 */
export async function createEvent(event: EventInsert) {
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
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data as Event;
}

/**
 * Update an event (admin only - requires auth)
 */
export async function updateEvent(id: string, updates: EventUpdate) {
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
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data as Event;
}

/**
 * Delete an event (admin only - requires auth)
 */
export async function deleteEvent(id: string) {
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
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }

  return { success: true };
}

