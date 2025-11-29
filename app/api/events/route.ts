import { NextRequest, NextResponse } from 'next/server';
import { createEventSchema, updateEventSchema } from '@/lib/validations';
import { createApiClient } from '@/lib/supabase/api-client';
import { createAdminClient } from '@/lib/supabase/server';
import type {
  EventInsert,
  EventUpdate,
  BuyTicketLink,
} from '@/lib/types/database.types';

// GET /api/events - Get all events or a single event by query param
export async function GET(request: NextRequest) {
  try {
    const supabase = createApiClient(request);
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get single event
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    }

    // Get all events
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/events - Create a new event
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
    const validatedData = createEventSchema.parse(body);

    const eventData: EventInsert = {
      date: validatedData.date.toISOString().split('T')[0],
      title: validatedData.title,
      description: validatedData.description,
      venue: validatedData.venue,
      start_time: validatedData.start_time,
      content: validatedData.content,
      image_url: validatedData.image_url || null,
      related_events:
        validatedData.related_events.length > 0
          ? validatedData.related_events
          : null,
      buy_ticket_links:
        validatedData.buy_ticket_links.length > 0
          ? (validatedData.buy_ticket_links as unknown as BuyTicketLink[])
          : null,
    };

    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
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
      error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/events - Update an event
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
    const validatedData = updateEventSchema.parse(body);

    if (!validatedData.id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { id, ...updates } = validatedData;

    const eventUpdates: EventUpdate = {};
    if (updates.date) {
      eventUpdates.date =
        updates.date instanceof Date
          ? updates.date.toISOString().split('T')[0]
          : updates.date;
    }
    if (updates.title !== undefined) eventUpdates.title = updates.title;
    if (updates.description !== undefined)
      eventUpdates.description = updates.description;
    if (updates.venue !== undefined) eventUpdates.venue = updates.venue;
    if (updates.start_time !== undefined)
      eventUpdates.start_time = updates.start_time;
    if (updates.content !== undefined) eventUpdates.content = updates.content;
    if (updates.image_url !== undefined) {
      eventUpdates.image_url = updates.image_url || null;
    }
    if (updates.related_events !== undefined) {
      eventUpdates.related_events =
        updates.related_events.length > 0 ? updates.related_events : null;
    }
    if (updates.buy_ticket_links !== undefined) {
      eventUpdates.buy_ticket_links =
        updates.buy_ticket_links.length > 0
          ? (updates.buy_ticket_links as unknown as BuyTicketLink[])
          : null;
    }

    if (updates.related_events !== undefined) {
      eventUpdates.related_events =
        updates.related_events.length > 0 ? updates.related_events : null;
    }

    if (updates.buy_ticket_links !== undefined) {
      eventUpdates.buy_ticket_links =
        updates.buy_ticket_links.length > 0
          ? (updates.buy_ticket_links as unknown as BuyTicketLink[])
          : null;
    }

    const { data, error } = await supabase
      .from('events')
      .update(eventUpdates)
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
      error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/events - Delete an event
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
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
