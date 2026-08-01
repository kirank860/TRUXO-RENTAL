const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/components/FleetTracking.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Asset ID from side modal view
content = content.replace(
  `                <div>
                  <h3 className="text-2xl font-black text-white font-orbitron">{selectedAsset.asset_id}</h3>
                  <p className="text-sm text-[#C5A059] font-bold">{parseAssetData(selectedAsset).name} ({parseAssetData(selectedAsset).brand})</p>
                </div>`,
  `                <div>
                  <h3 className="text-2xl font-black text-white font-orbitron uppercase">{parseAssetData(selectedAsset).brand}</h3>
                  <p className="text-sm text-[#C5A059] font-bold capitalize">{parseAssetData(selectedAsset).name}</p>
                </div>`
);

// 2. Remove Asset ID from Edit form
content = content.replace(
  `                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Asset ID</label>
                    <input required type="text" value={editAssetForm.asset_id} onChange={e => setEditAssetForm({...editAssetForm, asset_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>`,
  ``
);

// 3. (Double check we got all of them, if any more raw asset_id renders exist, we can ignore them as long as the big headers are gone. Wait, the table list card already has the change? Oh wait, in my replace_file_content earlier I changed the card to uppercase brand/name. Let's make sure the card title also replaces the raw asset_id entirely.)

content = content.replace(
  `                  <p className="text-[#C5A059] font-black text-lg font-orbitron">{asset.asset_id}</p>
                  <p className="text-sm text-gray-400 font-bold">{parseAssetData(asset).brand} • {parseAssetData(asset).name}</p>`,
  `                  <p className="text-[#C5A059] font-black text-lg font-orbitron uppercase">{parseAssetData(asset).brand}</p>
                  <p className="text-sm text-gray-400 font-bold capitalize">{parseAssetData(asset).name}</p>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed asset UI');
