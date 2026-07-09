"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, LogOut, Search, Loader2, Calendar, User, Mail, Wrench, 
  Inbox, LayoutDashboard, Truck, Settings, Bell, Filter, 
  MoreVertical, CheckCircle2, TrendingUp, Users, Activity, Clock, Trash2
} from "lucide-react";

type ContactRequest = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  equipment_required: string;
  created_at: string;
  status?: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
      } else {
        const errData = await res.json();
        alert("Server Error: " + errData.error);
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
      console.error("Failed to delete request");
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status: 'Approved' })
      });
      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
      } else {
        const errData = await res.json();
        alert("Server Error (You might need to add a 'status' column in Supabase!): " + errData.error);
      }
    } catch (err: any) {
      alert("Network Error: " + err.message);
    } finally {
      setActiveDropdown(null);
    }
  };

  const fetchRequests = async (pass: string) => {
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setRequests(data.requests);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_token", pass);
    } catch (err: any) {
      setLoginError(err.message);
      sessionStorage.removeItem("admin_token");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("admin_token");
    if (savedPassword) {
      setPassword(savedPassword);
      fetchRequests(savedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests(password);
  };

  const filteredRequests = requests.filter(req => 
    req.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.equipment_required.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#111113] p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DFBA73] to-[#C5A059]" />
          
          <div className="w-16 h-16 rounded-full bg-[#1A1C23] flex items-center justify-center border border-white/5 mb-6 mx-auto shadow-inner">
            <Lock className="w-6 h-6 text-[#C5A059]" />
          </div>
          
          <h1 className="text-2xl font-black text-white text-center font-orbitron uppercase tracking-widest mb-2">TRUXO OS</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Central Intelligence & Dispatch Command</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                placeholder="Access Token" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-center text-white font-black tracking-widest focus:outline-none focus:border-[#C5A059] transition-all shadow-inner placeholder:text-gray-700"
                required
              />
            </div>
            
            {loginError && <p className="text-[#A51A1A] text-xs font-bold text-center uppercase tracking-widest">{loginError}</p>}
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#111113] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F2EB] font-sans flex">
      
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0C] border-r border-white/5 flex-col sticky top-24 h-[calc(100vh-6rem)]">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-black text-white font-orbitron uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#C5A059]" /> TRUXO<span className="text-[#C5A059]">OS</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1C23]/50 text-[#C5A059] border border-[#C5A059]/20 font-bold text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dispatch Console
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 font-bold text-sm transition-colors">
            <Truck className="w-5 h-5" /> Fleet Tracking
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 font-bold text-sm transition-colors">
            <Users className="w-5 h-5" /> Clients
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 font-bold text-sm transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
              setRequests([]);
              sessionStorage.removeItem("admin_token");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-gray-400 hover:text-white hover:border-[#A51A1A]/50 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-24 pb-32 lg:pb-12 min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-20 lg:top-24 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between mt-4 lg:mt-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by client, email, or equipment..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111113] border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#C5A059]/50 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            <button className="p-2 rounded-full bg-[#111113] border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-colors relative">
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#C5A059]" />
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFBA73] to-[#C5A059] flex items-center justify-center text-[#12131A] font-black text-sm border-2 border-[#111113]">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight mb-2">Network Operations</h2>
            <p className="text-gray-400 font-medium">Real-time overview of active deployment requests.</p>
          </div>

          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Total Inquiries", value: requests.length, icon: Activity, color: "#C5A059", trend: "+12%" },
              { label: "Pending Dispatch", value: requests.length > 0 ? requests.length : 0, icon: Clock, color: "#DFBA73", trend: "Action Required" },
              { label: "Conversion Rate", value: "84%", icon: TrendingUp, color: "#25D366", trend: "+4%" }
            ].map((kpi, i) => (
              <motion.div 
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111113]/80 backdrop-blur-3xl rounded-3xl border border-white/5 p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1C23] border border-white/5 flex items-center justify-center">
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${kpi.trend.includes('+') ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-[#C5A059]/10 text-[#C5A059]'}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div>
                  <p className="text-4xl font-black text-white font-orbitron mb-1">{kpi.value}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{kpi.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Table Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-white uppercase tracking-widest font-orbitron">Active Requests</h3>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111113] border border-white/10 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Data Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#111113]/90 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent pointer-events-none" />
            <div className="overflow-x-auto relative z-10 min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A1C23]/80 border-b border-white/10">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</div></th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><User className="w-4 h-4" /> Client</div></th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Contact</div></th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron"><div className="flex items-center gap-2"><Wrench className="w-4 h-4" /> Equipment</div></th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#C5A059] font-orbitron">Status</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredRequests.length === 0 ? (
                      <motion.tr 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="p-20 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Inbox className="w-12 h-12 mb-4 opacity-30" />
                            <p className="font-medium text-lg">No requests found.</p>
                            <p className="text-sm mt-2 opacity-50">Try adjusting your search filters.</p>
                          </div>
                        </td>
                      </motion.tr>
                    ) : (
                      filteredRequests.map((req, index) => (
                        <motion.tr 
                          key={req.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <td className="p-6 whitespace-nowrap text-sm text-gray-400 group-hover:text-white transition-colors">
                            {new Date(req.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="p-6 whitespace-nowrap">
                            <p className="font-bold text-white text-base">{req.first_name} {req.last_name}</p>
                          </td>
                          <td className="p-6 whitespace-nowrap">
                            <p className="text-sm text-gray-300 font-medium">{req.email}</p>
                          </td>
                          <td className="p-6 text-sm text-gray-400 leading-relaxed max-w-xs truncate group-hover:text-gray-200 transition-colors">
                            {req.equipment_required}
                          </td>
                          <td className="p-6 whitespace-nowrap">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit ${req.status === 'Approved' ? 'bg-[#25D366]/10 border-[#25D366]/20' : 'bg-[#C5A059]/10 border-[#C5A059]/20'}`}>
                              <span className={`w-2 h-2 rounded-full ${req.status === 'Approved' ? 'bg-[#25D366]' : 'bg-[#C5A059] animate-pulse'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${req.status === 'Approved' ? 'text-[#25D366]' : 'text-[#C5A059]'}`}>
                                {req.status || 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 whitespace-nowrap text-right relative">
                            <button 
                              onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                              className="p-2 rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            <AnimatePresence>
                              {activeDropdown === req.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-12 top-10 bg-[#111113] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[160px]"
                                >
                                  {req.status !== 'Approved' && (
                                    <button 
                                      onClick={() => handleApprove(req.id)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/10 transition-colors border-b border-white/5"
                                    >
                                      <CheckCircle2 className="w-4 h-4" /> Approve
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDelete(req.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#A51A1A] hover:bg-[#A51A1A]/10 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
