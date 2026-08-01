import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabaseAdmin
      .from('fleet')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ fleet: data });
  } catch (error: unknown) {
    console.error('Error fetching fleet:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
