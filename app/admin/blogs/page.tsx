'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { Blog } from '@/lib/types/database.types';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadBlogs();
  }, []);

  const checkAuthAndLoadBlogs = async () => {
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

      await loadBlogs(session.access_token);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    }
  };

  const loadBlogs = async (accessToken: string) => {
    try {
      const response = await fetch('/api/blogs', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load blogs');
      }

      const data = await response.json();
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load blogs');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return;

    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      await loadBlogs(session.access_token);
    } catch (err) {
      alert('Failed to delete blog');
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
            <h1 className="h1 text-primary mb-2">Blog Management</h1>
            <p className="text-text/70">Manage your blog posts</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingBlog(null);
            }}
            className="px-6 py-2 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors"
          >
            + Create New Blog
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-md p-4 mb-6 text-red-300">
            {error}
          </div>
        )}

        {(showCreateForm || editingBlog) && (
          <BlogForm
            blog={editingBlog}
            onClose={() => {
              setShowCreateForm(false);
              setEditingBlog(null);
            }}
            onSuccess={async () => {
              const supabase = createSupabaseClient();
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                await loadBlogs(session.access_token);
              }
              setShowCreateForm(false);
              setEditingBlog(null);
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Read Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white-20">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text/70">
                      No blogs found. Create your first blog!
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-white-20">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text">{blog.title}</div>
                        <div className="text-sm text-text/60 mt-1 line-clamp-1">
                          {blog.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text/70">
                        {new Date(blog.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-text/70">{blog.read_time} min</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingBlog(blog);
                              setShowCreateForm(false);
                            }}
                            className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
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

function BlogForm({
  blog,
  onClose,
  onSuccess,
}: {
  blog: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    date: blog?.date ?? new Date().toISOString().split('T')[0],
    title: blog?.title ?? '',
    description: blog?.description ?? '',
    read_time: blog?.read_time ?? 5,
    content: blog?.content ?? '',
    image_url: blog?.image_url ?? '',
    related_blogs: blog?.related_blogs ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(blog?.image_url || null);

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
      const url = blog ? '/api/blogs' : '/api/blogs';
      const method = blog ? 'PUT' : 'POST';
      const body = blog
        ? { id: blog.id, ...formData }
        : formData;

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
        throw new Error(data.error || 'Failed to save blog');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white-20 backdrop-blur-sm border border-white-20 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="h3 text-primary">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-2 text-text">Read Time (minutes)</label>
            <input
              type="number"
              min="1"
              value={formData.read_time ?? 5}
              onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
              required
              className="w-full px-4 py-2 bg-background border border-white-20 rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text">Title</label>
          <input
            type="text"
            value={formData.title}
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
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

