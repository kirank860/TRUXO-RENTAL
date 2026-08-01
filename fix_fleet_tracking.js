const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/components/FleetTracking.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add parseAssetData helper
content = content.replace(
  `export type Client = {`,
  `export const parseAssetData = (asset: any) => {
  let parsedName = asset?.model || "";
  let parsedBrand = asset?.type || "";
  let parsedImg = "";
  try {
    const json = JSON.parse(asset.model);
    if (json.name) parsedName = json.name;
    if (json.brand) parsedBrand = json.brand;
    if (json.image) parsedImg = json.image;
  } catch (e) {
    if (asset?.model?.includes('||')) {
      const parts = asset.model.split('||').map((p: string) => p.trim());
      if (parts.length >= 3) {
        parsedBrand = parts[0];
        parsedName = parts[1];
        parsedImg = parts[2];
      }
    }
  }
  return { name: parsedName, brand: parsedBrand, image: parsedImg };
};

export type Client = {`
);

// 2. State definitions
content = content.replace(
  `const [newAsset, setNewAsset] = useState({ asset_id: "", type: "", model: "", daily_rent: "", hourly_rate: "" });`,
  `const [newAsset, setNewAsset] = useState({ asset_id: "", brand: "", name: "", image: "", daily_rent: "", hourly_rate: "" });`
);
content = content.replace(
  `const [editAssetForm, setEditAssetForm] = useState({ asset_id: "", type: "", model: "", daily_rent: "", hourly_rate: "" });`,
  `const [editAssetForm, setEditAssetForm] = useState({ asset_id: "", brand: "", name: "", image: "", daily_rent: "", hourly_rate: "" });`
);

// 3. handleAddAsset
content = content.replace(
  `body: JSON.stringify({ password, ...newAsset })`,
  `body: JSON.stringify({ password, ...newAsset, type: newAsset.brand, model: JSON.stringify({ brand: newAsset.brand, name: newAsset.name, image: newAsset.image }) })`
);
content = content.replace(
  `setFleet(prev => [{ ...newAsset, status: 'Available', client_id: null }, ...prev]);`,
  `setFleet(prev => [{ ...newAsset, type: newAsset.brand, model: JSON.stringify({ brand: newAsset.brand, name: newAsset.name, image: newAsset.image }), status: 'Available', client_id: null } as any, ...prev]);`
);
content = content.replace(
  `setNewAsset({ asset_id: "", type: "", model: "", daily_rent: "", hourly_rate: "" });`,
  `setNewAsset({ asset_id: "", brand: "", name: "", image: "", daily_rent: "", hourly_rate: "" });`
);

// 4. handleEditAsset
content = content.replace(
  `...editAssetForm`,
  `...editAssetForm, type: editAssetForm.brand, model: JSON.stringify({ brand: editAssetForm.brand, name: editAssetForm.name, image: editAssetForm.image })`
);
content = content.replace(
  `...editAssetForm,`,
  `...editAssetForm, type: editAssetForm.brand, model: JSON.stringify({ brand: editAssetForm.brand, name: editAssetForm.name, image: editAssetForm.image }),`
);

// 5. Edit Button click inside Modal
content = content.replace(
  `setEditAssetForm({
                      asset_id: selectedAsset.asset_id,
                      type: selectedAsset.type,
                      model: selectedAsset.model,
                      daily_rent: selectedAsset.daily_rent?.toString() || "1200",
                      hourly_rate: selectedAsset.hourly_rate?.toString() || "350"
                    });`,
  `const pData = parseAssetData(selectedAsset);
                    setEditAssetForm({
                      asset_id: selectedAsset.asset_id,
                      brand: pData.brand,
                      name: pData.name,
                      image: pData.image,
                      daily_rent: selectedAsset.daily_rent?.toString() || "1200",
                      hourly_rate: selectedAsset.hourly_rate?.toString() || "350"
                    });`
);

// 6. Edit Asset Form JSX
content = content.replace(
  `<div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Equipment Type</label>
                    <input required type="text" value={editAssetForm.type} onChange={e => setEditAssetForm({...editAssetForm, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Model</label>
                    <input required type="text" value={editAssetForm.model} onChange={e => setEditAssetForm({...editAssetForm, model: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>`,
  `<div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                    <input required type="text" value={editAssetForm.brand} onChange={e => setEditAssetForm({...editAssetForm, brand: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name / Model</label>
                    <input required type="text" value={editAssetForm.name} onChange={e => setEditAssetForm({...editAssetForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                    <input type="text" placeholder="/images/asset.jpg or https://..." value={editAssetForm.image} onChange={e => setEditAssetForm({...editAssetForm, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>`
);

// 7. Add Asset Form JSX
content = content.replace(
  `<div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Equipment Type</label>
                  <input required type="text" placeholder="e.g. Bulldozer" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Model</label>
                  <input required type="text" placeholder="e.g. CAT D8T" value={newAsset.model} onChange={e => setNewAsset({...newAsset, model: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>`,
  `<div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                  <input required type="text" placeholder="e.g. CAT" value={newAsset.brand} onChange={e => setNewAsset({...newAsset, brand: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Name / Model</label>
                  <input required type="text" placeholder="e.g. D8T Bulldozer" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                  <input type="text" placeholder="/images/asset.jpg or https://..." value={newAsset.image} onChange={e => setNewAsset({...newAsset, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>`
);

// 8. Fix Search filtering
content = content.replace(
  `const matchesSearch = asset.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) || asset.model.toLowerCase().includes(searchQuery.toLowerCase());`,
  `const pData = parseAssetData(asset);
    const matchesSearch = asset.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pData.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pData.brand.toLowerCase().includes(searchQuery.toLowerCase());`
);

// 9. Fix render of asset list cards
content = content.replace(
  `const isSelected = selectedAssetId === asset.asset_id;
            return (`,
  `const isSelected = selectedAssetId === asset.asset_id;
            const pData = parseAssetData(asset);
            return (`
);

content = content.replace(
  `<p className="text-gray-400 text-sm truncate">{asset.type} • {asset.model}</p>`,
  `<p className="text-gray-400 text-sm truncate">{pData.brand} • {pData.name}</p>`
);

// 10. Fix render in top of selected Asset Panel
content = content.replace(
  `<h3 className="text-2xl font-black text-white font-orbitron">{selectedAsset.asset_id}</h3>
                  <p className="text-sm text-[#C5A059] font-bold">{selectedAsset.model}</p>`,
  `<h3 className="text-2xl font-black text-white font-orbitron">{selectedAsset.asset_id}</h3>
                  <p className="text-sm text-[#C5A059] font-bold">{parseAssetData(selectedAsset).name} ({parseAssetData(selectedAsset).brand})</p>`
);

content = content.replace(
  `<p className="text-xl font-bold text-white capitalize">{selectedAsset.type}</p>`,
  `<p className="text-xl font-bold text-white capitalize">{parseAssetData(selectedAsset).brand}</p>`
);
content = content.replace(
  `<p className="text-xl font-bold text-white capitalize">{selectedAsset.model}</p>`,
  `<p className="text-xl font-bold text-white capitalize">{parseAssetData(selectedAsset).name}</p>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Script executed');
