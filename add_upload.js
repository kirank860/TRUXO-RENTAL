const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/components/FleetTracking.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add upload state and handler
content = content.replace(
  `  const [isSavingEdit, setIsSavingEdit] = useState(false);`,
  `  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (isEdit) {
          setEditAssetForm(prev => ({ ...prev, image: data.url }));
        } else {
          setNewAsset(prev => ({ ...prev, image: data.url }));
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };`
);

// Replace Edit Form Image Input
content = content.replace(
  `                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                    <input type="text" placeholder="/images/asset.jpg or https://..." value={editAssetForm.image} onChange={e => setEditAssetForm({...editAssetForm, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>`,
  `                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="/images/asset.jpg or URL" value={editAssetForm.image} onChange={e => setEditAssetForm({...editAssetForm, image: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                      <label className="flex items-center justify-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors shrink-0">
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, true)} />
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" /> : <Upload className="w-4 h-4 text-gray-400" />}
                      </label>
                    </div>
                  </div>`
);

// Replace Add Form Image Input
content = content.replace(
  `                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                  <input type="text" placeholder="/images/asset.jpg or https://..." value={newAsset.image} onChange={e => setNewAsset({...newAsset, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>`,
  `                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="/images/asset.jpg or URL" value={newAsset.image} onChange={e => setNewAsset({...newAsset, image: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                    <label className="flex items-center justify-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors shrink-0">
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, false)} />
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" /> : <Upload className="w-4 h-4 text-gray-400" />}
                    </label>
                  </div>
                </div>`
);

// We need to import Loader2
content = content.replace(
  `Trash2, Edit2 } from "lucide-react";`,
  `Trash2, Edit2, Loader2 } from "lucide-react";`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Script executed');
