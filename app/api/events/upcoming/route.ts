import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/queries/events';

// GET /api/events/upcoming - Get upcoming events
export async function GET() {
  try {
    const events = await getUpcomingEvents();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch upcoming events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


