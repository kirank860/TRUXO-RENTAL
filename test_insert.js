const { createClient } = require('@supabase/supabase-js');

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await supabaseAdmin
    .from('fleet')
    .insert({
      asset_id: "test-123456",
      type: "cat",
      model: JSON.stringify({ brand: "cat", name: "forklift", image: "/images/1234.jpg" }),
      location: 'Main Depot',
      hours: 0,
      status: 'Available',
      daily_rent: 1500,
      hourly_rate: 150
    });
  
  console.log("Error:", error);
}

test();
