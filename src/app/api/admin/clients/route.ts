import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .order('joined', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ clients: data });
  } catch (error: unknown) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { password, name, contact, email, phone } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Auto-generate unique client_id in CL-XXX format
    const clientId = `CL-${Math.floor(100 + Math.random() * 900)}`;

    const { error } = await supabaseAdmin.from('clients').insert({
      client_id: clientId,
      name,
      contact: contact || name,
      email,
      phone: phone || '',
      active_rentals: 0,
      total_spent: 'AED 0',
      joined: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true, client_id: clientId });
  } catch (error: unknown) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
