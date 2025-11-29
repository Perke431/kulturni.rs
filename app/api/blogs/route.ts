import { NextRequest, NextResponse } from 'next/server';
import { createBlogSchema, updateBlogSchema } from '@/lib/validations';
import { createApiClient } from '@/lib/supabase/api-client';
import { createAdminClient } from '@/lib/supabase/server';
import type { BlogInsert, BlogUpdate } from '@/lib/types/database.types';

// GET /api/blogs - Get all blogs or a single blog by query param
export async function GET(request: NextRequest) {
  try {
    const supabase = createApiClient(request);
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get single blog
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    }

    // Get all blogs
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch blogs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient(request);

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role using admin client (bypasses RLS)
    try {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden: Admin role required' },
          { status: 403 }
        );
      }
    } catch (adminError: any) {
      return NextResponse.json(
        {
          error:
            'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required',
          details:
            process.env.NODE_ENV === 'development'
              ? adminError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    const blogData: BlogInsert = {
      date: validatedData.date.toISOString().split('T')[0],
      title: validatedData.title,
      description: validatedData.description,
      read_time: validatedData.read_time,
      content: validatedData.content,
      image_url: validatedData.image_url || null,
      related_blogs:
        validatedData.related_blogs.length > 0
          ? validatedData.related_blogs
          : null,
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert(blogData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to create blog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/blogs - Update a blog
export async function PUT(request: NextRequest) {
  try {
    const supabase = createApiClient(request);

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role using admin client (bypasses RLS)
    try {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden: Admin role required' },
          { status: 403 }
        );
      }
    } catch (adminError: any) {
      return NextResponse.json(
        {
          error:
            'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required',
          details:
            process.env.NODE_ENV === 'development'
              ? adminError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    if (!validatedData.id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const { id, ...updates } = validatedData;

    const blogUpdates: BlogUpdate = {};
    if (updates.date) {
      blogUpdates.date =
        updates.date instanceof Date
          ? updates.date.toISOString().split('T')[0]
          : updates.date;
    }
    if (updates.title !== undefined) blogUpdates.title = updates.title;
    if (updates.description !== undefined)
      blogUpdates.description = updates.description;
    if (updates.read_time !== undefined)
      blogUpdates.read_time = updates.read_time;
    if (updates.content !== undefined) blogUpdates.content = updates.content;
    if (updates.image_url !== undefined) {
      blogUpdates.image_url = updates.image_url || null;
    }
    if (updates.related_blogs !== undefined) {
      blogUpdates.related_blogs =
        updates.related_blogs.length > 0 ? updates.related_blogs : null;
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(blogUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to update blog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/blogs - Delete a blog
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createApiClient(request);

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role using admin client (bypasses RLS)
    try {
      const adminClient = createAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden: Admin role required' },
          { status: 403 }
        );
      }
    } catch (adminError: any) {
      return NextResponse.json(
        {
          error:
            'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is required',
          details:
            process.env.NODE_ENV === 'development'
              ? adminError.message
              : undefined,
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete blog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
