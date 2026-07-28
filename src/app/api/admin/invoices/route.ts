import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FETCH ALL INVOICES
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
      .from('invoices')
      .select('*')
      .order('issued', { ascending: false });

    if (error) {
      // If table doesn't exist, just return empty array instead of crashing UI
      if (error.code === '42P01') {
        return NextResponse.json({ invoices: [] });
      }
      throw error;
    }

    return NextResponse.json({ invoices: data });
  } catch (error: unknown) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

// CREATE INVOICE
export async function PUT(request: Request) {
  try {
    const { password, client_name, client_id, equipment, amount, issued, due, items } = await request.json();
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

    // Auto-generate invoice ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const invoiceId = `INV-${year}-${randomNum}`;

    const { error } = await supabaseAdmin.from('invoices').insert({
      id: invoiceId,
      client: client_name,
      client_id,
      equipment,
      amount,
      issued: issued || new Date().toISOString(),
      due: due || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending',
      items: items || []
    });

    if (error) throw error;

    return NextResponse.json({ success: true, id: invoiceId });
  } catch (error: unknown) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

// UPDATE INVOICE STATUS
export async function PATCH(request: Request) {
  try {
    const { password, id, status } = await request.json();
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

    const { error } = await supabaseAdmin
      .from('invoices')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
