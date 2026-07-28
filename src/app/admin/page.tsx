"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LogOut, Search, Loader2, Calendar, User, Mail, Wrench,
  Inbox, LayoutDashboard, Truck, Settings, Bell, Filter,
  MoreVertical, CheckCircle2, TrendingUp, Users, Activity, Clock,
  Trash2, Home, X, BarChart3, DollarSign, ChevronRight,
  AlertTriangle, Receipt, Package, Zap, ArrowRight
} from "lucide-react";
import FleetTracking from "./components/FleetTracking";
import ClientDirectory from "./components/ClientDirectory";
import Analytics from "./components/Analytics";
import Overview from "./components/Overview";
import SystemSettings from "./components/SystemSettings";
import Invoices from "./components/Invoices";

type ActiveTab = "overview" | "dispatch" | "fleet" | "clients" | "analytics" | "invoices" | "settings";

type ContactRequest = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  equipment_required: string;
  created_at: string;
  status?: string;
};

type Toast = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [fleetAssetId, setFleetAssetId] = useState<string | null>(null);
  const [dispatchFilter, setDispatchFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleTrackAsset = (assetId: string) => {
    setActiveTab("fleet");
    setFleetAssetId(assetId);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
        showToast("success", "Request deleted successfully.");
      } else {
        const errData = await res.json();
        showToast("error", "Error: " + errData.error);
      }
    } catch (err: unknown) {
      showToast("error", "Network Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status: "Approved" })
      });
      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
        showToast("success", "Request approved. Client account created.");
      } else {
        const errData = await res.json();
        showToast("error", errData.error || "Approval failed.");
      }
    } catch (err: unknown) {
      showToast("error", "Network Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, status: "Rejected" })
      });
      if (res.ok) {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
        showToast("info", "Request rejected.");
      } else {
        const errData = await res.json();
        showToast("error", errData.error || "Rejection failed.");
      }
    } catch (err: unknown) {
      showToast("error", "Network Error: " + (err instanceof Error ? err.message : String(err)));
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
      if (!res.ok) throw new Error(data.error || "Login failed");
      setRequests(data.requests);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_token", pass);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : String(err));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setRequests([]);
    sessionStorage.removeItem("admin_token");
  };

  const filteredRequests = requests.filter(req => {
    const matchSearch =
      req.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.equipment_required.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      dispatchFilter === "All" ||
      (dispatchFilter === "Pending" && (!req.status || req.status === "Pending")) ||
      req.status === dispatchFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = requests.filter(r => !r.status || r.status === "Pending").length;

  // ── NAV ITEMS ─────────────────────────────────────────────────────────────
  const navGroups = [
    {
      label: "Operations",
      items: [
        { id: "overview",  label: "Overview",    icon: LayoutDashboard, badge: null },
        { id: "dispatch",  label: "Dispatch",     icon: Inbox,           badge: pendingCount > 0 ? pendingCount : null },
        { id: "fleet",     label: "Fleet",         icon: Truck,           badge: null },
      ]
    },
    {
      label: "Business",
      items: [
        { id: "clients",   label: "Clients",       icon: Users,           badge: null },
        { id: "analytics", label: "Analytics",     icon: BarChart3,       badge: null },
        { id: "invoices",  label: "Invoices",       icon: Receipt,         badge: null },
      ]
    },
    {
      label: "System",
      items: [
        { id: "settings",  label: "Settings",       icon: Settings,        badge: null },
      ]
    }
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ──────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#111113] p-8 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059]" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-[#1A1C23] flex items-center justify-center border border-[#C5A059]/20 mb-6 mx-auto shadow-inner">
            <Lock className="w-7 h-7 text-[#C5A059]" />
          </div>

          <h1 className="text-2xl font-black text-white text-center font-orbitron uppercase tracking-widest mb-1">TRUXO OS</h1>
          <p className="text-gray-500 text-xs text-center mb-8 uppercase tracking-widest font-bold">Enterprise Resource Platform · v2.0</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Access Token</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-center text-white font-black tracking-widest focus:outline-none focus:border-[#C5A059]/50 transition-all placeholder:text-gray-700"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#A51A1A]/10 border border-[#A51A1A]/20">
                <AlertTriangle className="w-4 h-4 text-[#A51A1A] flex-shrink-0" />
                <p className="text-xs text-[#A51A1A] font-bold">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#111113] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authenticate <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            <span className="font-bold uppercase tracking-widest">Secured by Supabase RLS</span>
          </div>
        </motion.div>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN ERP DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F2EB] font-sans flex">

      {/* ── TOAST SYSTEM ── */}
      <div className="fixed top-6 right-6 z-[200] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl pointer-events-auto min-w-[260px] max-w-xs ${
                toast.type === "success" ? "bg-[#0A1F0A] border-[#25D366]/30 text-[#25D366]" :
                toast.type === "error"   ? "bg-[#1F0A0A] border-[#A51A1A]/30 text-[#A51A1A]" :
                                           "bg-[#111113] border-white/15 text-gray-300"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              {toast.type === "error"   && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {toast.type === "info"    && <Activity className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
              <p className="text-xs font-bold">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-60 bg-[#0A0A0C] border-r border-white/5 flex-col sticky top-0 h-screen z-30">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DFBA73] to-[#C5A059] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-[#111113]" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white font-orbitron uppercase tracking-widest leading-tight">TRUXO<span className="text-[#C5A059]">OS</span></h1>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">ERP Platform v2.0</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 px-3 mb-1.5">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ActiveTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
                        isActive
                          ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20"
                          : "text-gray-600 hover:text-gray-300 hover:bg-white/4"
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C5A059] rounded-r-full" />}
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left text-xs">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-black bg-[#DFBA73] text-[#111113] rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0">{item.badge > 9 ? "9+" : item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DFBA73] to-[#C5A059] flex items-center justify-center text-[#111113] font-black text-xs flex-shrink-0">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">Administrator</p>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#111113] border border-white/8 text-gray-500 hover:text-[#A51A1A] hover:border-[#A51A1A]/30 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="sticky top-0 lg:top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          {/* Tab title on desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
              {navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
            </span>
          </div>
          {/* Search */}
          <div className="relative flex-1 max-w-sm lg:max-w-xs ml-0 lg:ml-auto mr-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111113] border border-white/8 rounded-full pl-10 pr-5 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]/40 transition-colors placeholder:text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl bg-[#111113] border border-white/8 hover:border-white/15 text-gray-500 hover:text-white transition-colors">
              {pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DFBA73] border border-[#050505]" />}
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DFBA73] to-[#C5A059] flex items-center justify-center text-[#111113] font-black text-xs border border-[#C5A059]/30">AD</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Overview
                  onNavigate={(tab) => setActiveTab(tab as ActiveTab)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </motion.div>
            )}

            {/* ── DISPATCH ── */}
            {activeTab === "dispatch" && (
              <motion.div key="dispatch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight mb-1">Dispatch Console</h2>
                  <p className="text-gray-400 font-medium text-sm">Real-time management of incoming rental requests.</p>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Total Inquiries", value: requests.length, icon: Activity, color: "#C5A059", trend: "+12%" },
                    { label: "Pending Review",  value: pendingCount,   icon: Clock,    color: "#DFBA73", trend: pendingCount > 0 ? "Action Needed" : "All Clear" },
                    { label: "Approved",        value: requests.filter(r => r.status === "Approved").length, icon: CheckCircle2, color: "#25D366", trend: "Clients created" },
                  ].map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="bg-[#111113] border border-white/8 rounded-2xl p-5 relative overflow-hidden group hover:border-white/15 transition-all"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at top right, ${kpi.color}10, transparent 70%)` }} />
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                          <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.trend}</span>
                      </div>
                      <p className="text-3xl font-black text-white font-orbitron mb-0.5">{kpi.value}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{kpi.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Filter Tabs + Table */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {(["All", "Pending", "Approved", "Rejected"] as const).map(f => (
                      <button key={f} onClick={() => setDispatchFilter(f)}
                        className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dispatchFilter === f ? "bg-[#C5A059] text-[#111113]" : "bg-[#111113] border border-white/10 text-gray-500 hover:text-white"}`}
                      >
                        {f}
                        {f === "Pending" && pendingCount > 0 && <span className="ml-1.5 bg-[#111113] text-[#DFBA73] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#111113] border border-white/10 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-[#111113] border border-white/8 rounded-2xl overflow-hidden"
                >
                  <div className="overflow-x-auto min-h-[320px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0A0A0C] border-b border-white/8">
                          {["Date", "Client", "Contact", "Equipment", "Status", ""].map(h => (
                            <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredRequests.length === 0 ? (
                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <td colSpan={6} className="px-5 py-20 text-center">
                                <Inbox className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500 font-bold">No requests found</p>
                                <p className="text-gray-700 text-sm mt-1">Try adjusting your filter or search query.</p>
                              </td>
                            </motion.tr>
                          ) : filteredRequests.map((req, index) => (
                            <motion.tr key={req.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                              className="border-b border-white/5 hover:bg-white/3 transition-colors group cursor-pointer"
                            >
                              <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                                {new Date(req.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <p className="font-bold text-white text-sm">{req.first_name} {req.last_name}</p>
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <p className="text-xs text-gray-400">{req.email}</p>
                              </td>
                              <td className="px-5 py-4 text-xs text-gray-400 max-w-[180px] truncate">{req.equipment_required}</td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit ${
                                  req.status === "Approved"  ? "bg-[#25D366]/10 border-[#25D366]/25" :
                                  req.status === "Rejected"  ? "bg-[#A51A1A]/10 border-[#A51A1A]/25" :
                                                               "bg-[#DFBA73]/10 border-[#DFBA73]/25"
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    req.status === "Approved"  ? "bg-[#25D366]" :
                                    req.status === "Rejected"  ? "bg-[#A51A1A]" :
                                                                 "bg-[#DFBA73] animate-pulse"
                                  }`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    req.status === "Approved"  ? "text-[#25D366]" :
                                    req.status === "Rejected"  ? "text-[#A51A1A]" :
                                                                 "text-[#DFBA73]"
                                  }`}>{req.status || "Pending"}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-right relative">
                                <button onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                                  className="p-2 rounded-lg text-gray-600 hover:bg-white/8 hover:text-white transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                  {activeDropdown === req.id && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                      className="absolute right-10 top-10 bg-[#111113] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[150px]"
                                    >
                                      {req.status !== "Approved" && req.status !== "Rejected" && (
                                        <>
                                          <button onClick={() => handleApprove(req.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/10 transition-colors border-b border-white/5"
                                          >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                          </button>
                                          <button onClick={() => handleReject(req.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#FF8C00] hover:bg-[#FF8C00]/10 transition-colors border-b border-white/5"
                                          >
                                            <X className="w-4 h-4" /> Reject
                                          </button>
                                        </>
                                      )}
                                      <button onClick={() => handleDelete(req.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#A51A1A] hover:bg-[#A51A1A]/10 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" /> Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── OTHER TABS ── */}
            {activeTab === "fleet" && (
              <motion.div key="fleet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <FleetTracking activeAssetId={fleetAssetId} setActiveAssetId={setFleetAssetId} />
              </motion.div>
            )}
            {activeTab === "clients" && (
              <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ClientDirectory onTrackAsset={handleTrackAsset} />
              </motion.div>
            )}
            {activeTab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Analytics />
              </motion.div>
            )}
            {activeTab === "invoices" && (
              <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Invoices />
              </motion.div>
            )}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <SystemSettings onLogout={handleLogout} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
        <div className="bg-[#0A0A0C]/97 backdrop-blur-xl border-t border-white/8 pt-3 pb-8 px-6 flex justify-around items-center">
          {[
            { id: "overview",  icon: LayoutDashboard, label: "Home" },
            { id: "dispatch",  icon: Inbox,           label: "Dispatch", badge: pendingCount },
            { id: "fleet",     icon: Truck,            label: "Fleet" },
            { id: "clients",   icon: Users,            label: "Clients" },
            { id: "analytics", icon: BarChart3,        label: "Reports" },
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id as ActiveTab)} className="flex flex-col items-center gap-1 relative">
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DFBA73] text-[#111113] text-[8px] font-black flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
                <item.icon className={`w-5 h-5 transition-all ${isActive ? "text-[#C5A059] scale-110" : "text-gray-600"}`} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? "text-[#C5A059]" : "text-gray-600"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </main>
  );
}
