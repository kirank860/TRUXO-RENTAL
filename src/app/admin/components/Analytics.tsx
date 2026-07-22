"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Truck, DollarSign, BarChart3, PieChart, Zap } from "lucide-react";

type Client = {
  client_id: string;
  name: string;
  total_spent: string;
  active_rentals: number;
  joined: string;
};

type FleetAsset = {
  asset_id: string;
  status: string;
};

function parseAED(val: string): number {
  if (!val) return 0;
  const clean = val.replace("AED ", "").trim();
  if (clean.endsWith("M")) return parseFloat(clean) * 1_000_000;
  if (clean.endsWith("K")) return parseFloat(clean) * 1_000;
  return parseInt(clean.replace(/,/g, "")) || 0;
}

function formatAED(val: number): string {
  if (val >= 1_000_000) return `AED ${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `AED ${(val / 1_000).toFixed(0)}K`;
  return `AED ${val.toLocaleString()}`;
}

export default function Analytics() {
  const [clients, setClients] = useState<Client[]>([]);
  const [fleet, setFleet] = useState<FleetAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const password = sessionStorage.getItem("admin_token");
        const [resC, resF] = await Promise.all([
          fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }),
          fetch("/api/admin/fleet",   { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }),
        ]);
        if (resC.ok) { const d = await resC.json(); setClients(d.clients || []); }
        if (resF.ok) { const d = await resF.json(); setFleet(d.fleet || []); }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const totalRevenue = clients.reduce((s, c) => s + parseAED(c.total_spent), 0);
  const deployed    = fleet.filter(f => f.status === "Deployed").length;
  const available   = fleet.filter(f => f.status === "Available").length;
  const maintenance = fleet.filter(f => f.status === "Maintenance").length;
  const totalAssets = fleet.length || 1;

  // Top clients sorted by revenue descending
  const topClients = [...clients]
    .map(c => ({ ...c, revenue: parseAED(c.total_spent) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const maxRevenue = topClients[0]?.revenue || 1;

  // Donut chart segments (SVG)
  const donutData = [
    { label: "Deployed",    value: deployed,    color: "#25D366" },
    { label: "Available",   value: available,   color: "#C5A059" },
    { label: "Maintenance", value: maintenance, color: "#A51A1A" },
  ];
  const total = donutData.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const RADIUS = 60, CX = 80, CY = 80, STROKE = 18;
  const circumference = 2 * Math.PI * RADIUS;

  const kpis = [
    { label: "Total Revenue",   value: formatAED(totalRevenue), icon: DollarSign, color: "#C5A059",  sub: "All time" },
    { label: "Active Clients",  value: clients.length,           icon: Users,      color: "#25D366",  sub: "Approved" },
    { label: "Fleet Deployed",  value: `${deployed}/${totalAssets}`, icon: Truck,  color: "#DFBA73",  sub: "Assets" },
    { label: "Avg. Contract",   value: clients.length ? formatAED(Math.round(totalRevenue / clients.length)) : "AED 0", icon: Zap, color: "#7C83FD", sub: "Per client" },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin mr-3" />
      Loading analytics…
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-black text-white font-orbitron uppercase tracking-tight mb-2">Revenue Analytics</h2>
        <p className="text-gray-400 font-medium">Power BI-style financial command center for Truxo.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-[#111113] border border-white/8 rounded-2xl p-5 relative overflow-hidden group hover:border-white/15 transition-all"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at top right, ${kpi.color}10, transparent 70%)` }} />
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{kpi.sub}</span>
            </div>
            <p className="text-2xl font-black text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue by Client Bar Chart — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#111113] border border-white/8 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-[#C5A059]" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Revenue by Client</h3>
          </div>

          {topClients.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-600 text-sm">No revenue data yet. Assign equipment to clients!</div>
          ) : (
            <div className="space-y-4">
              {topClients.map((client, i) => {
                const pct = maxRevenue ? (client.revenue / maxRevenue) * 100 : 0;
                const hue = 180 + i * 22;
                const barColor = i === 0 ? "#C5A059" : i === 1 ? "#DFBA73" : "#7C83FD";
                return (
                  <motion.div
                    key={client.client_id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-gray-300 truncate max-w-[140px]">{client.name || client.client_id}</span>
                      <span className="text-xs font-black" style={{ color: i === 0 ? "#C5A059" : "#F5F2EB" }}>{client.total_spent || "AED 0"}</span>
                    </div>
                    <div className="h-6 w-full bg-white/5 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease: "easeOut" }}
                        className="h-full rounded-lg flex items-center px-2 relative overflow-hidden"
                        style={{ background: `linear-gradient(90deg, ${barColor}cc, ${barColor}55)` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Fleet Utilization Donut — 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#111113] border border-white/8 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Fleet Utilization</h3>
          </div>

          <div className="flex flex-col items-center">
            {/* SVG Donut */}
            <svg viewBox="0 0 160 160" className="w-44 h-44 mb-6 -rotate-90">
              {/* Track */}
              <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#ffffff08" strokeWidth={STROKE} />
              {/* Segments */}
              {donutData.map((seg, idx) => {
                const segLen = (seg.value / total) * circumference;
                const offset = -cumulative * circumference / total;
                cumulative += seg.value;
                return (
                  <circle
                    key={seg.label}
                    cx={CX} cy={CY} r={RADIUS}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={STROKE}
                    strokeDasharray={`${segLen} ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${seg.color}80)` }}
                  />
                );
              })}
              {/* Center text */}
              <text x={CX} y={CY - 6} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="18" fontWeight="900" transform={`rotate(90 ${CX} ${CY})`}>
                {total}
              </text>
              <text x={CX} y={CY + 14} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize="7" fontWeight="700" transform={`rotate(90 ${CX} ${CY})`}>
                TOTAL
              </text>
            </svg>

            {/* Legend */}
            <div className="w-full space-y-2">
              {donutData.map(seg => (
                <div key={seg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: seg.color, boxShadow: `0 0 6px ${seg.color}80` }} />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{seg.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">{seg.value}</span>
                    <span className="text-xs text-gray-600 ml-1">({total > 0 ? Math.round((seg.value / total) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-[#111113] border border-white/8 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[#7C83FD]" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Client Revenue Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">#</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">Client</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">ID</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">Active</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">Total Revenue</th>
                <th className="text-right text-[10px] uppercase tracking-widest text-gray-600 pb-3 font-bold">Share</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, i) => {
                const share = totalRevenue ? Math.round((client.revenue / totalRevenue) * 100) : 0;
                return (
                  <tr key={client.client_id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3 text-gray-600 font-bold text-xs">{i + 1}</td>
                    <td className="py-3">
                      <span className="text-sm font-bold text-white">{client.name || "—"}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-1 rounded-md">{client.client_id}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${client.active_rentals > 0 ? 'bg-[#25D366]' : 'bg-gray-600'}`} />
                        <span className="text-sm text-white font-bold">{client.active_rentals}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`text-sm font-black ${client.revenue > 0 ? 'text-[#C5A059]' : 'text-gray-600'}`}>{client.total_spent || "AED 0"}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-xs font-bold text-gray-400">{share}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td colSpan={4} className="pt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Total</td>
                <td className="pt-4 text-right text-base font-black text-[#C5A059]">{formatAED(totalRevenue)}</td>
                <td className="pt-4 text-right text-xs font-black text-gray-400">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
