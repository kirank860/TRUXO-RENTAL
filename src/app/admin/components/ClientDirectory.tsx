import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Mail, Phone, Building2, Calendar, FileText, X, Briefcase, CreditCard, Receipt, MapPin, TrendingUp, CheckCircle2, Truck } from "lucide-react";

export type Client = {
  client_id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  active_rentals: number;
  total_spent: string;
  joined: string;
};

export type FleetAsset = {
  asset_id: string;
  type: string;
  model: string;
  location: string;
  client_id: string | null;
};

export default function ClientDirectory({ onTrackAsset }: { onTrackAsset?: (assetId: string) => void } = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [fleet, setFleet] = useState<FleetAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const password = sessionStorage.getItem("admin_token");
        const res = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients || []);
        }

        const resFleet = await fetch("/api/admin/fleet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (resFleet.ok) {
          const data = await resFleet.json();
          setFleet(data.fleet || []);
        }
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const selectedClient = clients.find(c => c.client_id === selectedClientId);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight mb-2">Client Directory</h2>
        <p className="text-gray-400 font-medium">Manage corporate relationships, contracts, and active accounts.</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search clients by name, ID, or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111113] border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition-colors"
          />
        </div>
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#111113] text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
          + Add Client
        </button>
      </div>

      {/* Client List */}
      <div className="bg-[#111113]/90 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1C23] border-b border-white/10">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Company</div></th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><Users className="w-4 h-4" /> Contact Person</div></th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Active Rentals</div></th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron">Total Value</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">No clients found matching "{searchQuery}"</td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <motion.tr 
                    key={client.client_id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-6">
                      <p className="font-bold text-white text-lg">{client.name}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{client.client_id} • Joined {new Date(client.joined).getFullYear()}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-gray-300 font-medium">{client.contact}</p>
                      <div className="flex items-center gap-3 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <a href={`mailto:${client.email}`} className="text-[#C5A059] hover:text-white"><Mail className="w-3 h-3" /></a>
                        <a href={`tel:${client.phone}`} className="text-[#C5A059] hover:text-white"><Phone className="w-3 h-3" /></a>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${client.active_rentals > 0 ? 'bg-[#25D366]' : 'bg-gray-600'}`} />
                        <span className="text-white font-black font-orbitron">{client.active_rentals} Units</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-white font-bold">{client.total_spent}</p>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setSelectedClientId(client.client_id)}
                        className="text-xs font-bold text-[#C5A059] uppercase tracking-widest hover:text-white transition-colors border border-[#C5A059]/30 px-4 py-2 rounded-lg hover:bg-[#C5A059]/10"
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Profile Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedClientId(null)}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
            />
            
            {/* Centered Panel */}
            <motion.div 
              data-lenis-prevent="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-[#111113] border border-white/10 shadow-2xl rounded-3xl overflow-y-auto overscroll-contain scrollbar-hide"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#111113]/90 backdrop-blur-md z-10">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/20">
                    <Building2 className="w-8 h-8 text-[#C5A059]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white font-orbitron">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Client ID: <span className="text-[#C5A059]">{selectedClient.client_id}</span></p>
                  </div>
                </div>
                <button onClick={() => setSelectedClientId(null)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Contact Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Primary Contact</h4>
                    <p className="text-lg font-bold text-white mb-2">{selectedClient.contact}</p>
                    <div className="space-y-2">
                      <a href={`mailto:${selectedClient.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><Mail className="w-4 h-4" /> {selectedClient.email}</a>
                      <a href={`tel:${selectedClient.phone}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><Phone className="w-4 h-4" /> {selectedClient.phone}</a>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Billing Address</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      TRUXO Tower, Office 402<br />
                      Sheikh Zayed Road<br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>

                {/* Account Health */}
                <section>
                  <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Account Overview</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#111113] p-6 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Total Lifetime Value</p>
                      <p className="text-xl font-black text-[#C5A059]">{selectedClient.total_spent}</p>
                    </div>
                    <div className="bg-[#111113] p-6 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Active Rentals</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${selectedClient.active_rentals > 0 ? 'bg-[#25D366]' : 'bg-gray-600'}`} />
                        <p className="text-xl font-black text-white">{selectedClient.active_rentals}</p>
                      </div>
                    </div>
                    <div className="bg-[#1A1C23]/50 border border-white/5 rounded-xl p-4">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Credit Limit</p>
                      <p className="text-xl font-black text-white">AED 2.5M</p>
                    </div>
                  </div>
                </section>

                {/* Active Rentals List */}
                {selectedClient.active_rentals > 0 && (
                  <section className="mb-8">
                    <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Current Deployments</h4>
                    <div className="space-y-3">
                      {fleet.filter(f => f.client_id === selectedClient.client_id).map(asset => (
                        <div key={asset.asset_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C5A059]/30 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                              <Truck className="w-5 h-5 text-[#25D366]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{asset.type} • {asset.model} <span className="text-gray-500 text-xs ml-2">#{asset.asset_id}</span></p>
                              <p className="text-xs text-gray-400 mt-1">{asset.location}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => onTrackAsset && onTrackAsset(asset.asset_id)}
                            className="text-xs font-bold text-[#C5A059] hover:text-white uppercase tracking-widest"
                          >
                            Track
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Corporate Documents */}
                <section>
                  <h4 className="text-xs uppercase tracking-widest font-black text-gray-400 mb-4 flex items-center gap-2"><Receipt className="w-4 h-4" /> Corporate Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-colors group">
                      <FileText className="w-6 h-6 text-gray-400 mb-3 group-hover:text-[#C5A059] transition-colors" />
                      <p className="text-sm font-bold text-white">Trade License</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#25D366]" /> Verified</p>
                    </button>
                    <button className="p-4 rounded-xl border border-white/10 hover:bg-white/5 text-left transition-colors group">
                      <FileText className="w-6 h-6 text-gray-400 mb-3 group-hover:text-[#C5A059] transition-colors" />
                      <p className="text-sm font-bold text-white">Master Service Agreement</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#25D366]" /> Signed 2021</p>
                    </button>
                  </div>
                </section>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
