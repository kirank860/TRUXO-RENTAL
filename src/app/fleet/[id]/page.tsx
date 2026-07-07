import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fleetInventory } from "@/data";
import VehicleViewer from "@/components/ui/VehicleViewer";
import { ChevronRight, Calendar, MapPin, Tag, Palette, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Factory } from "lucide-react";

// Image mapping helper based on category
const getVehicleImage = (category: string, type: string) => {
  const c = category.toLowerCase();
  const t = type.toLowerCase();

  if (c.includes("forklift")) return "/images/forklift_warehouse.jpg";
  if (t.includes("wheel excavator") || c.includes("jcb")) return "/images/wheel_shovel.jpg";
  if (t.includes("excavator")) return "/images/company_excavator.jpg";
  return "/images/heavy_crane.jpg";
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FleetSpecPage({ params }: Props) {
  const { id } = await params;

  const vehicleId = parseInt(id, 10);
  const vehicle = fleetInventory.find((v) => v.id === vehicleId);

  if (!vehicle) {
    notFound();
  }

  const imageSrc = getVehicleImage(vehicle.category, vehicle.type);

  // Get other fleet recommendations (excluding current)
  const recommendations = fleetInventory.filter((v) => v.id !== vehicleId).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F2EB] font-sans pb-24 md:pb-0 selection:bg-[#C5A059] selection:text-[#12131A]">
      
      {/* Immersive Hero Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <Image 
            src={imageSrc} 
            alt={vehicle.brand} 
            fill 
            priority
            className="object-cover filter brightness-[0.25]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase mb-8">
            <Link href="/fleet" className="text-gray-400 hover:text-[#C5A059] flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Fleet
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#C5A059]">{vehicle.brand}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full bg-[#111113]/80 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                  {vehicle.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase">
                  ID: {vehicle.id}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black uppercase text-white tracking-tight drop-shadow-2xl">
                {vehicle.brand}
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 font-bold mt-2 uppercase tracking-wide">{vehicle.type}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        
        {/* 360 / Interactive Viewer */}
        <div className="mb-24 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl border border-white/5">
          <VehicleViewer imageSrc={imageSrc} title={vehicle.brand} />
        </div>

        {/* Specifications & Sticky Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">

          {/* Main Specs Column */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-16">
            
            <section>
              <h2 className="text-sm font-black text-[#C5A059] uppercase tracking-[0.3em] font-orbitron mb-8 flex items-center gap-4">
                Technical Data
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[#C5A059]/30 to-transparent" />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col gap-3 hover:bg-[#111113] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Model Year</span>
                  <span className="text-3xl font-black text-white font-orbitron tracking-tight">{vehicle.year}</span>
                </div>

                <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col gap-3 hover:bg-[#111113] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Location</span>
                  <span className="text-3xl font-black text-white font-orbitron tracking-tight">{vehicle.location}</span>
                </div>

                <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col gap-3 hover:bg-[#111113] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registration Plate</span>
                  <span className="text-3xl font-black text-white font-orbitron tracking-tight font-mono">{vehicle.plate}</span>
                </div>

                <div className="bg-[#111113]/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col gap-3 hover:bg-[#111113] transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                    <Palette className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Standard Color</span>
                  <span className="text-3xl font-black text-white font-orbitron tracking-tight">{vehicle.color}</span>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#111113] to-[#0A0A0C] p-10 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#C5A059]" />
                Equipment Certification
              </h3>
              
              <ul className="space-y-6 font-bold text-gray-400">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A059] shrink-0" /> 
                  <span className="leading-relaxed">Full preventative maintenance completed under UAE heavy equipment compliance guidelines.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A059] shrink-0" /> 
                  <span className="leading-relaxed">Available for immediate deployment to any site with our rapid transport team.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A059] shrink-0" /> 
                  <span className="leading-relaxed">Includes 24/7 dedicated on-call mechanical support and troubleshooting.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* High-End Sticky Ecommerce CTA Sidebar */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="bg-[#111113]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-[#C5A059]/20 shadow-[0_0_50px_rgba(197,160,89,0.05)] sticky top-32">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#DFBA73] to-[#C5A059] flex items-center justify-center text-[#12131A] mb-8 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                <Factory className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-orbitron font-black uppercase text-white mb-4 tracking-tight">Deploy this Asset</h3>
              <p className="text-gray-400 font-medium text-sm mb-10 leading-relaxed">
                Skip the waitlist. Contact our specialized procurement team to lock in daily, weekly, or monthly rates for the {vehicle.brand}.
              </p>
              
              <div className="space-y-4">
                <Link href="/contact" className="group flex items-center justify-between w-full p-5 rounded-2xl bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-[#12131A] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:shadow-[0_0_40px_rgba(197,160,89,0.4)] active:scale-[0.98] transition-all">
                  Get Pricing Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="group flex items-center justify-between w-full p-5 rounded-2xl bg-transparent border border-white/10 text-white hover:border-[#25D366]/50 hover:bg-[#25D366]/10 font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all">
                  WhatsApp Sales
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#25D366] transition-colors" />
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Fast Approval Process</span>
              </div>
            </div>
          </div>

        </div>

        {/* Other Fleet Options - Upgraded to match new /fleet design */}
        <div className="pt-16 border-t border-white/5">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-4xl font-orbitron font-black uppercase text-white tracking-tight">
              Other <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFBA73] to-[#C5A059]">Options</span>
            </h2>
            <Link href="/fleet" className="text-xs font-black tracking-widest uppercase text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
              View Fleet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={`/fleet/${rec.id}`}
                className="group rounded-[2rem] bg-[#111113]/80 backdrop-blur-xl border border-white/5 shadow-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] hover:border-[#C5A059]/30 hover:-translate-y-1 active:scale-95 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={getVehicleImage(rec.category, rec.type)} 
                    alt={rec.brand} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.7] group-hover:brightness-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 pr-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block mb-1 font-orbitron">{rec.type}</span>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase font-orbitron drop-shadow-md leading-none">{rec.brand}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[#C5A059] transition-colors">
                    View Specifications <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
