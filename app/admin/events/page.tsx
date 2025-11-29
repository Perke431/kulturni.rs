'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Event, BuyTicketLink } from '@/lib/types/database.types';
import Link from 'next/link';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadEvents();
  }, []);

  const checkAuthAndLoadEvents = async () => {
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

      await loadEvents(session.access_token);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    }
  };

  const loadEvents = async (accessToken: string) => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load events');
      }

      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return;

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await loadEvents(session.access_token);
    } catch (err) {
      alert('Failed to delete event');
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-primary hover:text-primary/80 mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="h1 text-primary mb-2">Event Management</h1>
            <p className="text-text/70">Manage your events</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingEvent(null);
            }}
            className="px-6 py-2 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors"
          >
            + Create New Event
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-md p-4 mb-6 text-red-300">
            {error}
          </div>
        )}

        {(showCreateForm || editingEvent) && (
          <EventForm
            event={editingEvent}
            onClose={() => {
              setShowCreateForm(false);
              setEditingEvent(null);
            }}
            onSuccess={async () => {
              const supabase = createSupabaseClient();
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                await loadEvents(session.access_token);
              }
              setShowCreateForm(false);
              setEditingEvent(null);
            }}
          />
        )}

        <div className="bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white-30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Venue</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white-20">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text/70">
                      No events found. Create your first event!
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-white-20">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text">{event.title}</div>
                        <div className="text-sm text-text/60 mt-1 line-clamp-1">
                          {event.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text/70">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-text/70">{event.venue}</td>
                      <td className="px-6 py-4 text-text/70">{event.start_time}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowCreateForm(false);
                            }}
                            className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Normalize time format from database (HH:MM:SS -> HH:MM)
function normalizeTime(time: string | null | undefined): string {
  if (!time) return '20:00';
  // If time includes seconds (HH:MM:SS), remove them
  if (time.includes(':') && time.split(':').length === 3) {
    return time.split(':').slice(0, 2).join(':');
  }
  return time;
}

function EventForm({
  event,
  onClose,
  onSuccess,
}: {
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    date: event?.date ?? new Date().toISOString().split('T')[0],
    title: event?.title ?? '',
    description: event?.description ?? '',
    venue: event?.venue ?? '',
    start_time: normalizeTime(event?.start_time),
    content: event?.content ?? '',
    image_url: event?.image_url ?? '',
    buy_ticket_links: (event?.buy_ticket_links as BuyTicketLink[] | null) || [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(event?.image_url || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const url = '/api/events';
      const method = event ? 'PUT' : 'POST';
      
      // Ensure start_time is in HH:MM format
      const normalizedFormData = {
        ...formData,
        start_time: normalizeTime(formData.start_time),
      };
      
      const body = event
        ? { id: event.id, ...normalizedFormData }
        : normalizedFormData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save event');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const addTicketLink = () => {
    setFormData({
      ...formData,
      buy_ticket_links: [...formData.buy_ticket_links, { label: '', url: '' }],
    });
  };

  const removeTicketLink = (index: number) => {
    setFormData({
      ...formData,
      buy_ticket_links: formData.buy_ticket_links.filter((_, i) => i !== index),
    });
  };

  const updateTicketLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...formData.buy_ticket_links];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, buy_ticket_links: updated });
  };

  return (
    <div className="bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="h3 text-primary">{event ? 'Edit Event' : 'Create New Event'}</h2>
        <button
          onClick={onClose}
          className="text-text/70 hover:text-text"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-md p-3 mb-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Date</label>
            <input
              type="date"
              value={formData.date ?? new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Start Time (HH:MM)</label>
            <input
              type="time"
              value={formData.start_time ?? '20:00'}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
              className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-text">Venue</label>
            <input
              type="text"
              value={formData.venue ?? ''}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              required
              className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Title</label>
          <input
            type="text"
            value={formData.title ?? ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Description</label>
          <textarea
            value={formData.description ?? ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setUploading(true);
              setError('');

              try {
                const supabase = createSupabaseClient();
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                  throw new Error('Not authenticated');
                }

                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                uploadFormData.append('folder', 'images');

                const response = await fetch('/api/upload', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${session.access_token}`,
                  },
                  body: uploadFormData,
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to upload image');
                }

                setFormData({ ...formData, image_url: data.url });
                setPreviewImage(data.url);
              } catch (err: any) {
                setError(err.message || 'Failed to upload image');
              } finally {
                setUploading(false);
              }
            }}
            className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-background hover:file:bg-primary/90"
            disabled={uploading}
          />
          {uploading && (
            <p className="mt-2 text-sm text-text/70">Uploading image...</p>
          )}
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-xs max-h-48 object-cover rounded border border-white-20"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, image_url: '' });
                  setPreviewImage(null);
                }}
                className="mt-2 text-sm text-red-300 hover:text-red-200"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Content (HTML)</label>
          <textarea
            value={formData.content ?? ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={10}
            className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter HTML content here..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-text">Buy Ticket Links</label>
            <button
              type="button"
              onClick={addTicketLink}
              className="text-sm text-primary hover:text-primary/80"
            >
              + Add Link
            </button>
          </div>
          {formData.buy_ticket_links.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Label (e.g., 'Buy Tickets')"
                value={link.label}
                onChange={(e) => updateTicketLink(index, 'label', e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateTicketLink(index, 'url', e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeTicketLink(index)}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-white-20 text-text rounded-md hover:bg-white-30 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

