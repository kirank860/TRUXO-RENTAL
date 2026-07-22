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

export async function PATCH(request: Request) {
  try {
    const { password, asset_id, client_id, location, new_status } = await request.json();
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

    // ── CASE 1: Simple status change (Available ↔ Maintenance) ──────────────
    if (new_status && new_status !== 'Deployed') {
      const { error: fleetError } = await supabaseAdmin
        .from('fleet')
        .update({ status: new_status })
        .eq('asset_id', asset_id);
      if (fleetError) throw fleetError;
      return NextResponse.json({ success: true });
    }

    // ── CASE 2: Return asset from client (Deployed → Available) ──────────────
    if (new_status === 'Available' || (new_status && client_id === null)) {
      // Fetch which client currently has this asset
      const { data: assetData } = await supabaseAdmin
        .from('fleet')
        .select('client_id')
        .eq('asset_id', asset_id)
        .single();

      const { error: fleetError } = await supabaseAdmin
        .from('fleet')
        .update({ status: 'Available', client_id: null, location: 'Main Depot' })
        .eq('asset_id', asset_id);
      if (fleetError) throw fleetError;

      // Decrement client's active_rentals
      if (assetData?.client_id) {
        const { data: clientData } = await supabaseAdmin
          .from('clients')
          .select('active_rentals')
          .eq('client_id', assetData.client_id)
          .single();
        if (clientData) {
          await supabaseAdmin
            .from('clients')
            .update({ active_rentals: Math.max(0, (clientData.active_rentals || 1) - 1) })
            .eq('client_id', assetData.client_id);
        }
      }
      return NextResponse.json({ success: true });
    }

    // ── CASE 3: Assign asset to a client (→ Deployed) ────────────────────────
    const { error: fleetError } = await supabaseAdmin
      .from('fleet')
      .update({ 
        status: 'Deployed', 
        client_id: client_id,
        location: location || 'Client Job Site'
      })
      .eq('asset_id', asset_id);
    if (fleetError) throw fleetError;

    // Fetch current client data
    const { data: clientData, error: clientFetchError } = await supabaseAdmin
      .from('clients')
      .select('active_rentals, total_spent')
      .eq('client_id', client_id)
      .single();
    if (clientFetchError) throw clientFetchError;

    // Simulate AED 50,000 contract per assigned asset
    let newTotalSpent = "AED 50,000";
    if (clientData?.total_spent) {
      let currentVal = clientData.total_spent.replace("AED ", "").trim();
      let numericVal = 0;
      if (currentVal.endsWith("M")) {
        numericVal = parseFloat(currentVal) * 1000000;
      } else if (currentVal.endsWith("K")) {
        numericVal = parseFloat(currentVal) * 1000;
      } else {
        numericVal = parseInt(currentVal.replace(/,/g, "")) || 0;
      }
      numericVal += 50000;
      if (numericVal >= 1000000) {
        newTotalSpent = `AED ${(numericVal / 1000000).toFixed(1)}M`;
      } else {
        newTotalSpent = `AED ${numericVal.toLocaleString()}`;
      }
    }

    const { error: clientUpdateError } = await supabaseAdmin
      .from('clients')
      .update({ 
        active_rentals: (clientData?.active_rentals || 0) + 1,
        total_spent: newTotalSpent
      })
      .eq('client_id', client_id);
    if (clientUpdateError) throw clientUpdateError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { password, asset_id, type, model, location, hours } = await request.json();
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

    const { error: insertError } = await supabaseAdmin
      .from('fleet')
      .insert({
        asset_id,
        type,
        model,
        location: location || 'Main Depot',
        hours: parseInt(hours) || 0,
        status: 'Available'
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error adding asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { password, asset_id } = await request.json();
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

    const { error: deleteError } = await supabaseAdmin
      .from('fleet')
      .delete()
      .eq('asset_id', asset_id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
