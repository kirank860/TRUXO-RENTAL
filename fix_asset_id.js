const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/components/FleetTracking.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Asset ID input field from Add Modal
content = content.replace(
  `                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Asset ID</label>
                  <input required type="text" placeholder="e.g. BD-088" value={newAsset.asset_id} onChange={e => setNewAsset({...newAsset, asset_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>`,
  ``
);

// 2. Modify handleAddAsset to auto-generate asset_id
content = content.replace(
  `    try {
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...newAsset, type: newAsset.brand, model: \`\${newAsset.brand}||\${newAsset.name}||\${newAsset.image}\` })
      });`,
  `    try {
      const generatedAssetId = \`AST-\${Math.random().toString(36).substring(2, 8).toUpperCase()}\`;
      const finalAsset = { ...newAsset, asset_id: generatedAssetId };
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...finalAsset, type: finalAsset.brand, model: \`\${finalAsset.brand}||\${finalAsset.name}||\${finalAsset.image}\` })
      });`
);

content = content.replace(
  `setFleet(prev => [{ ...newAsset, type: newAsset.brand, model: \`\${newAsset.brand}||\${newAsset.name}||\${newAsset.image}\`, status: 'Available', client_id: null } as any, ...prev]);`,
  `setFleet(prev => [{ ...newAsset, asset_id: generatedAssetId, type: newAsset.brand, model: \`\${newAsset.brand}||\${newAsset.name}||\${newAsset.image}\`, status: 'Available', client_id: null } as any, ...prev]);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed asset id generation');
