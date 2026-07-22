import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Search, Filter, Activity, Settings, Wrench, AlertTriangle, CheckCircle2, X, FileText, Settings2, BarChart3, ActivitySquare, MapPin, ChevronDown, Download, Eye, Upload, Trash2 } from "lucide-react";

export type FleetAsset = {
  asset_id: string;
  type: string;
  model: string;
  status: string;
  client_id: string | null;
  location: string;
  hours: number;
};

export type Client = {
  client_id: string;
  name: string;
};

export default function FleetTracking({ activeAssetId, setActiveAssetId }: { activeAssetId?: string | null, setActiveAssetId?: (id: string | null) => void } = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localAssetId, setLocalAssetId] = useState<string | null>(null);
  const [fleet, setFleet] = useState<FleetAsset[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedClientToAssign, setSelectedClientToAssign] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ asset_id: "", type: "", model: "", location: "Main Depot", hours: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmAsset, setDeleteConfirmAsset] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  const selectedAssetId = activeAssetId !== undefined ? activeAssetId : localAssetId;
  const setSelectedAssetId = setActiveAssetId || setLocalAssetId;

  const [showDocs, setShowDocs] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const password = sessionStorage.getItem("admin_token");
        const resFleet = await fetch("/api/admin/fleet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (resFleet.ok) {
          const data = await resFleet.json();
          setFleet(data.fleet || []);
        }

        const resClients = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (resClients.ok) {
          const data = await resClients.json();
          setClients(data.clients || []);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedClientToAssign || !selectedAssetId) return;
    try {
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, asset_id: selectedAssetId, client_id: selectedClientToAssign })
      });
      if (res.ok) {
        setFleet(prev => prev.map(f => f.asset_id === selectedAssetId ? { ...f, status: 'Deployed', client_id: selectedClientToAssign } : f));
        setIsAssigning(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...newAsset })
      });
      if (res.ok) {
        setFleet(prev => [{ ...newAsset, status: 'Available', client_id: null }, ...prev]);
        setShowAddModal(false);
        setNewAsset({ asset_id: "", type: "", model: "", location: "Main Depot", hours: 0 });
      } else {
        alert("Failed to add asset");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAsset = async (asset_id: string) => {
    setIsDeleting(true);
    try {
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, asset_id })
      });
      if (res.ok) {
        setFleet(prev => prev.filter(f => f.asset_id !== asset_id));
        if (selectedAssetId === asset_id) setSelectedAssetId(null);
        setDeleteConfirmAsset(null);
      } else {
        alert("Failed to delete asset");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (asset_id: string, new_status: string) => {
    setIsChangingStatus(true);
    try {
      const password = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/fleet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, asset_id, new_status })
      });
      if (res.ok) {
        setFleet(prev => prev.map(f => {
          if (f.asset_id !== asset_id) return f;
          if (new_status === 'Available') return { ...f, status: 'Available', client_id: null, location: 'Main Depot' };
          return { ...f, status: new_status };
        }));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const selectedAsset = fleet.find(a => a.asset_id === selectedAssetId);

  const filteredFleet = fleet.filter(asset => {
    const clientName = clients.find(c => c.client_id === asset.client_id)?.name || "";
    return asset.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight mb-2">Fleet Command Center</h2>
        <p className="text-gray-400 font-medium">Real-time status and deployment tracking of all heavy assets.</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Assets", value: fleet.length.toString(), icon: Truck, color: "#FFFFFF" },
          { label: "Deployed", value: fleet.filter(a => a.status === 'Deployed').length.toString(), icon: Activity, color: "#25D366" },
          { label: "Available", value: fleet.filter(a => a.status === 'Available').length.toString(), icon: CheckCircle2, color: "#C5A059" },
          { label: "In Maintenance", value: fleet.filter(a => a.status === 'Maintenance').length.toString(), icon: Wrench, color: "#A51A1A" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-[#111113] border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-[#1A1C23] flex items-center justify-center border border-white/5">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white font-orbitron">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by ID, Model, or Location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111113] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111113] border border-white/10 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#12131A] transition-colors text-xs font-black uppercase tracking-wider"
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* Fleet Grid */}
      {filteredFleet.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-[#111113]/50 rounded-2xl border border-white/10">
          No equipment found matching "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFleet.map((asset, i) => (
            <motion.div 
              key={asset.asset_id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#C5A059]/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10 group-hover:bg-[#C5A059]/5 transition-colors" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[#C5A059] font-black text-lg font-orbitron">{asset.asset_id}</p>
                  <p className="text-sm text-gray-400 font-bold">{asset.type} • {asset.model}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  asset.status === 'Deployed' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20' : 
                  asset.status === 'Available' ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20' :
                  'bg-[#A51A1A]/10 text-[#A51A1A] border-[#A51A1A]/20'
                }`}>
                  {asset.status}
                </div>
              </div>

              <div className="space-y-2 mt-6 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase tracking-wider">Location</span>
                  <span className="text-white font-medium">{asset.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Client</span>
                  <span className="text-white font-bold">{asset.client_id ? clients.find(c => c.client_id === asset.client_id)?.name : "-"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase tracking-wider">Engine Hours</span>
                  <span className="text-white font-medium">{asset.hours} hrs</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => setSelectedAssetId(asset.asset_id)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors uppercase tracking-widest border border-white/5"
                >View Details</button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Centered Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAssetId(null)}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
            />
            
            {/* Centered Panel */}
            <motion.div 
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl max-h-[90vh] bg-[#111113] border border-white/10 shadow-2xl rounded-3xl overflow-y-auto overscroll-contain scrollbar-hide"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111113]/90 backdrop-blur-md z-10">
                <div>
                  <h3 className="text-2xl font-black text-white font-orbitron">{selectedAsset.asset_id}</h3>
                  <p className="text-sm text-[#C5A059] font-bold">{selectedAsset.model}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeleteConfirmAsset(selectedAsset.asset_id)} className="p-2 rounded-full hover:bg-[#A51A1A]/10 text-[#A51A1A] transition-colors group">
                    <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => setSelectedAssetId(null)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 pb-24 space-y-8">
                {/* Status Card with Action Buttons */}
                <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedAsset.status === 'Deployed' ? 'bg-[#25D366]/20 text-[#25D366]' : selectedAsset.status === 'Available' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#A51A1A]/20 text-[#A51A1A]'}`}>
                      <ActivitySquare className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Current Status</p>
                      <p className="text-lg font-bold text-white">{selectedAsset.status}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.status === 'Deployed' && (
                      <button
                        onClick={() => handleStatusChange(selectedAsset.asset_id, 'Available')}
                        disabled={isChangingStatus}
                        className="flex-1 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-black uppercase tracking-widest hover:bg-[#25D366]/20 transition-colors disabled:opacity-50"
                      >
                        ↩ Mark as Returned
                      </button>
                    )}
                    {selectedAsset.status === 'Available' && (
                      <button
                        onClick={() => handleStatusChange(selectedAsset.asset_id, 'Maintenance')}
                        disabled={isChangingStatus}
                        className="flex-1 py-2.5 rounded-xl bg-[#A51A1A]/10 border border-[#A51A1A]/30 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-[#A51A1A]/20 transition-colors disabled:opacity-50"
                      >
                        🔧 Send to Maintenance
                      </button>
                    )}
                    {selectedAsset.status === 'Maintenance' && (
                      <button
                        onClick={() => handleStatusChange(selectedAsset.asset_id, 'Available')}
                        disabled={isChangingStatus}
                        className="flex-1 py-2.5 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-black uppercase tracking-widest hover:bg-[#C5A059]/20 transition-colors disabled:opacity-50"
                      >
                        ✅ Mark as Available
                      </button>
                    )}
                  </div>
                </div>

                {/* Assignment Details */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Assignment</h4>
                    {selectedAsset.status === 'Available' && (
                      <button 
                        onClick={() => setIsAssigning(!isAssigning)}
                        className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] font-black uppercase tracking-widest px-3 py-1.5 rounded-full hover:bg-[#C5A059]/30 transition-colors"
                      >
                        {isAssigning ? "Cancel" : "Assign Asset"}
                      </button>
                    )}
                  </div>

                  {isAssigning ? (
                    <div className="bg-[#1A1C23]/80 rounded-xl p-5 border border-[#C5A059]/30">
                      <p className="text-sm text-gray-300 font-medium mb-3">Select a Client for Deployment:</p>
                      <select 
                        value={selectedClientToAssign}
                        onChange={(e) => setSelectedClientToAssign(e.target.value)}
                        className="w-full bg-[#111113] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A059]/50 mb-4"
                      >
                        <option value="">-- Choose Client --</option>
                        {clients.map(c => (
                          <option key={c.client_id} value={c.client_id}>{c.name} ({c.client_id})</option>
                        ))}
                      </select>
                      <button 
                        onClick={handleAssign}
                        disabled={!selectedClientToAssign}
                        className="w-full py-3 bg-[#C5A059] hover:bg-[#b08d4a] text-[#12131A] font-black rounded-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Confirm Assignment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-[#1A1C23]/50 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Assigned Client</span>
                        <span className="text-white font-bold">{selectedAsset.client_id ? clients.find(c => c.client_id === selectedAsset.client_id)?.name : "-"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span className="text-white font-bold">{selectedAsset.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Return</span>
                        <span className="text-white font-medium">{selectedAsset.status === 'Deployed' ? 'In 3 Days' : 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Telematics & Maintenance */}
                <section>
                  <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4" /> Telematics</h4>
                  <div className="space-y-3 bg-[#1A1C23]/50 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Engine Hours</span>
                      <span className="text-white font-bold">{selectedAsset.hours} hrs</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Service</span>
                      <span className="text-white font-medium">{selectedAsset.hours - 150} hrs ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Next Maintenance</span>
                      <span className="text-[#C5A059] font-bold">In 50 hrs</span>
                    </div>
                  </div>
                </section>

                {/* Financials Placeholder */}
                <section>
                  <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Financials</h4>
                  <div className="bg-gradient-to-br from-[#DFBA73]/10 to-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl p-4">
                    <p className="text-sm text-gray-300 mb-2">Daily Rental Rate: <strong className="text-white">AED 1,200</strong></p>
                    <p className="text-sm text-gray-300">Total Revenue: <strong className="text-[#25D366]">AED 340,000</strong></p>
                  </div>
                </section>
                
                {/* Documents */}
                <section>
                  <button 
                    onClick={() => setShowDocs(!showDocs)}
                    className="w-full py-4 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold text-sm flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> View Registration & Documents</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDocs ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showDocs && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-3">
                          {/* Document Item 1 */}
                          <div className="bg-[#1A1C23] border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#A51A1A]/10 flex items-center justify-center border border-[#A51A1A]/20">
                                <FileText className="w-5 h-5 text-[#A51A1A]" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">RTA Registration (Mulkiya)</p>
                                <p className="text-xs text-gray-500">Expires: Oct 12, 2026</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 mr-2">Valid</span>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
                            </div>
                          </div>

                          {/* Document Item 2 */}
                          <div className="bg-[#1A1C23] border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                                <FileText className="w-5 h-5 text-[#C5A059]" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">Comprehensive Insurance</p>
                                <p className="text-xs text-[#C5A059]">Expiring in 14 Days</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 mr-2">Soon</span>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Upload className="w-4 h-4" /></button>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#111113] border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1A1C23]">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Add New Equipment</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAsset} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Asset ID</label>
                  <input required type="text" placeholder="e.g. BD-088" value={newAsset.asset_id} onChange={e => setNewAsset({...newAsset, asset_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Equipment Type</label>
                  <input required type="text" placeholder="e.g. Bulldozer" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Model</label>
                  <input required type="text" placeholder="e.g. CAT D8T" value={newAsset.model} onChange={e => setNewAsset({...newAsset, model: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</label>
                    <input required type="text" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Engine Hours</label>
                    <input required type="number" min="0" value={newAsset.hours} onChange={e => setNewAsset({...newAsset, hours: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#C5A059]/50 focus:outline-none" />
                  </div>
                </div>
                <button disabled={isAdding} type="submit" className="w-full mt-4 py-4 bg-[#C5A059] hover:bg-[#b08d4a] text-[#12131A] font-black rounded-xl uppercase tracking-widest transition-colors disabled:opacity-50">
                  {isAdding ? "Adding..." : "Add to Fleet"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmAsset && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteConfirmAsset(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm bg-[#111113] border border-[#A51A1A]/40 shadow-[0_0_60px_rgba(165,26,26,0.3)] rounded-3xl overflow-hidden"
            >
              {/* Red accent top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#A51A1A] via-red-500 to-[#A51A1A]" />

              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#A51A1A]/10 border border-[#A51A1A]/30 flex items-center justify-center mb-5">
                  <Trash2 className="w-9 h-9 text-[#A51A1A]" />
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Confirm Deletion</h3>
                <p className="text-gray-400 text-sm mb-1">You are about to permanently remove</p>
                <p className="text-[#C5A059] font-black text-lg tracking-widest mb-1">#{deleteConfirmAsset}</p>
                <p className="text-gray-500 text-xs mb-8">This action cannot be undone. The asset will be removed from your fleet database.</p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirmAsset(null)}
                    disabled={isDeleting}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(deleteConfirmAsset)}
                    disabled={isDeleting}
                    className="flex-1 py-3 rounded-xl bg-[#A51A1A] hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Deleting...</>
                    ) : (
                      <><Trash2 className="w-4 h-4" /> Delete</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
