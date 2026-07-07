import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fleetInventory } from "@/data";
import VehicleViewer from "@/components/ui/VehicleViewer";
import { ChevronRight, Calendar, MapPin, Tag, Palette, CheckCircle2, ArrowLeft } from "lucide-react";

// Image mapping helper based on category
const getVehicleImage = (category: string, type: string) => {
  const c = category.toLowerCase();
  const t = type.toLowerCase();

  if (c.includes("forklift")) return "/images/forklift_warehouse.jpg";
  if (t.includes("wheel excavator") || c.includes("jcb")) return "/images/wheel_shovel.jpg";
  if (t.includes("excavator")) return "/images/company_excavator.jpg";
  return "/images/company_excavator.jpg";
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
    <main className="min-h-screen pt-32 pb-24 bg-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12">
          <Link href="/fleet" className="text-gray-500 hover:text-[#C5A059] flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Fleet
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#111113]">{vehicle.brand}</span>
        </div>

        {/* Dynamic Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#111113] text-[#C5A059] text-xs font-bold tracking-widest uppercase">
                {vehicle.category}
              </span>
              <span className="px-3 py-1 rounded-full border border-black/10 text-[#111113] text-xs font-bold tracking-widest uppercase">
                ID: {vehicle.id}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl lg:text-7xl font-orbitron font-black uppercase text-[#111113] tracking-tight">
              {vehicle.brand}
            </h1>
            <p className="text-xl text-gray-500 font-bold mt-2 uppercase">{vehicle.type}</p>
          </div>

          <div className="flex gap-4">
            <Link href="/contact" className="px-8 py-4 rounded-full btn-premium-gold shadow-xl text-sm tracking-widest text-center whitespace-nowrap">
              REQUEST QUOTE
            </Link>
          </div>
        </div>

        {/* 360 / Interactive Viewer */}
        <div className="mb-24">
          <VehicleViewer imageSrc={imageSrc} title={vehicle.brand} />
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">

          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-orbitron font-black uppercase text-[#111113] mb-8 border-b-2 border-black/5 pb-4">
                Technical Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" /> Model Year
                  </span>
                  <span className="text-2xl font-black text-[#111113]">{vehicle.year}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <span className="text-2xl font-black text-[#111113]">{vehicle.location}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <Tag className="w-4 h-4" /> Plate Number
                  </span>
                  <span className="text-2xl font-black text-[#111113]">{vehicle.plate}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <Palette className="w-4 h-4" /> Color
                  </span>
                  <span className="text-2xl font-black text-[#111113]">{vehicle.color}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111113] p-8 rounded-3xl text-white">
              <h3 className="text-xl font-orbitron font-black text-[#C5A059] uppercase tracking-widest mb-6">Equipment Highlights</h3>
              <ul className="space-y-4 font-bold text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#C5A059]" /> Regularly serviced and inspected</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#C5A059]" /> Available for immediate deployment</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#C5A059]" /> Includes expert technical support</li>
              </ul>
            </div>
          </div>

          {/* Quick Contact Sidebar */}
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-xl h-fit sticky top-32">
            <h3 className="text-2xl font-orbitron font-black uppercase text-[#111113] mb-6">Need this equipment?</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Contact our sales team to get immediate pricing and availability for this {vehicle.brand}.
            </p>
            <div className="space-y-4">
              <Link href="/contact" className="w-full block px-8 py-4 rounded-full bg-[#111113] text-white font-bold text-center uppercase tracking-widest text-sm hover:bg-[#A51A1A] transition-colors">
                Contact Sales Team
              </Link>
              <a href="https://wa.me/971501234567" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-black/10 text-[#111113] font-bold text-center uppercase tracking-widest text-sm hover:border-[#111113] transition-colors">
                WhatsApp Us
              </a>
            </div>
          </div>

        </div>

        {/* Other Fleet Options */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-orbitron font-black uppercase text-[#111113] tracking-tight">
              Other <span className="text-[#C5A059]">Options</span>
            </h2>
            <Link href="/fleet" className="text-sm font-bold tracking-widest uppercase text-gray-500 hover:text-[#111113] flex items-center gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={`/fleet/${rec.id}`}
                className="group bg-white rounded-3xl p-6 border border-black/5 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-6 relative">
                  <Image
                    src={getVehicleImage(rec.category, rec.type)}
                    alt={rec.brand}
                    width={800}
                    height={600}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {rec.category}
                  </div>
                </div>
                <h3 className="text-xl font-black font-orbitron text-[#111113] uppercase mb-1">{rec.brand}</h3>
                <p className="text-gray-500 font-bold text-sm mb-6 uppercase">{rec.type}</p>
                <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-[#C5A059]">
                  View Specs <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
