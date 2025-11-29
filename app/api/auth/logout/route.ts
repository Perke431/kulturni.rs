import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}

