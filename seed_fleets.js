const { createClient } = require('@supabase/supabase-js');

async function seedFleets() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1. Delete all existing fleets
  const { error: deleteError } = await supabase
    .from('fleet')
    .delete()
    .neq('asset_id', 'something_that_will_never_match');

  if (deleteError) {
    console.error("Error deleting old fleets:", deleteError);
    return;
  }
  console.log("Deleted old fleets.");

  // 2. Insert new fleets
  const newFleets = [
    { brand: "Genie", name: "Articulated Boom Lift" },
    { brand: "JCB", name: "Rough Terrain Forklift" },
    { brand: "Bobcat", name: "Compact Track Loader" },
    { brand: "Caterpillar", name: "Heavy Crawler Excavator" },
    { brand: "Liebherr", name: "Mobile Hydraulic Crane" },
    { brand: "Bomag", name: "Single-Drum Soil Compactor" }
  ];

  for (const f of newFleets) {
    const assetId = `AST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const modelStr = `${f.brand}||${f.name}||`; // empty image

    const { error: insertError } = await supabase
      .from('fleet')
      .insert({
        asset_id: assetId,
        type: f.brand,
        model: modelStr,
        location: 'Dubai',
        hours: 0,
        status: 'Available',
        daily_rent: 1200,
        hourly_rate: 300
      });

    if (insertError) {
      console.error(`Error inserting ${f.name}:`, insertError);
    } else {
      console.log(`Inserted: ${f.name}`);
    }
  }

  console.log("Done seeding new fleets!");
}

seedFleets();
