"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Layers,
  Shield,
  HardHat,
  Settings,
  Wrench,
  Check,
  Phone,
  Mail,
  Globe,
  MapPin,
  Play,
  Maximize2,
  Minimize2,
  Info,
  Calendar,
  Compass,
  X
} from "lucide-react";
import Link from "next/link";
import { companyProfile, whyChooseUs } from "@/data";
import { ProductivityChart, OperationTrendsChart, WorkBreakdownChart } from "@/components/ui/Charts";

export default function Home() {
  const [viewMode, setViewMode] = useState<"website" | "presentation">("website");
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 12;

  // Presentation Mode Triggers & Keyboard Nav
  useEffect(() => {
    // Check URL
    if (typeof window !== "undefined") {
      if (window.location.search.includes("mode=presentation")) {
        setViewMode("presentation");
        setCurrentSlide(0);
        // Clean URL
        window.history.replaceState({}, "", "/");
      }
    }

    // Custom Event Listener
    const handleOpenPresentation = () => {
      setViewMode("presentation");
      setCurrentSlide(0);
    };
    window.addEventListener("open-presentation", handleOpenPresentation);

    // Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "presentation") return;
      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "Enter") {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-presentation", handleOpenPresentation);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewMode]);
  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  // Specs for Slide 5 Columns
  const columnsData = [
    {
      title: "Excavators",
      img: "/images/excavator_digging.jpg",
      desc: "Our excavators are designed for heavy-duty earthmoving and construction applications. They are ideal for excavation, trenching, foundation work, demolition, site preparation, and material handling.",
    },
    {
      title: "Forklifts",
      img: "/images/forklift_warehouse.jpg",
      desc: "Our forklifts are designed for efficient material handling, loading, unloading, stacking, and transportation of goods in warehouses, factories, logistics centers, and construction sites.",
    },
    {
      title: "Wheel Shovels",
      img: "/images/wheel_shovel.jpg",
      desc: "Our wheel shovels (front-end loaders) are built for efficient loading, transporting, and stockpiling of materials such as sand, gravel, soil, and aggregates.",
    },
    {
      title: "Cranes",
      img: "/images/heavy_crane.jpg",
      desc: "We provide a comprehensive fleet of cranes ranging from 5-ton to 100-ton lifting capacity, including mobile cranes for versatile lifting operations.",
    },
    {
      title: "UD Trucks",
      img: "/images/ud_truck.jpg",
      desc: "Our UD trucks provide reliable and efficient transportation solutions for construction, industrial, and logistics operations. Built for durability and high performance.",
    }
  ];

  const slideTransitions = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] text-[#111113] overflow-hidden pt-24">


      {viewMode === "presentation" ? (
        /* ========================================================================= */
        /* PRESENTATION MODE (Full-screen Slider)                                     */
        /* ========================================================================= */
        <div className="relative h-[82vh] max-w-7xl mx-auto px-6 flex items-center justify-center">
          {/* Main Slide Card Container */}
          <div className="w-full h-full max-h-[700px] bg-white border-4 border-[#111113] rounded-[32px] shadow-[12px_12px_0px_#111113] overflow-hidden relative flex flex-col justify-between">

            {/* Header Area of the Slides */}
            <div className="p-6 border-b-2 border-[#111113] bg-[#F5F2EB]/50 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3">
                <img src="/logo.jpeg" alt="TRUXO Logo" className="h-8 object-contain" />
                <span className="font-orbitron font-black text-lg tracking-tighter text-[#111113]">TRUXO RENTAL</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block px-4 py-1.5 rounded-full bg-[#111113] text-white font-orbitron font-bold text-xs uppercase tracking-wider">
                  Slide {currentSlide + 1} of {totalSlides}
                </div>
                <button
                  onClick={() => setViewMode("website")}
                  className="p-2 rounded-full bg-white border-2 border-[#111113] text-[#111113] hover:bg-[#A51A1A] hover:text-white hover:border-[#A51A1A] transition-colors shadow-sm"
                  title="Exit Presentation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide Body */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden relative bg-[#F5F2EB]/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideTransitions}
                  className="w-full h-full p-8 md:p-12 flex flex-col justify-center"
                >
                  {/* SLIDE 1: Hero */}
                  {currentSlide === 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-6">
                        <div className="relative p-6 rounded-2xl bg-[#A51A1A]/10 border-l-8 border-[#A51A1A]">
                          <h1 className="text-3xl md:text-4xl font-black font-orbitron tracking-wide text-[#111113] uppercase leading-tight">
                            TRUXO HEAVY <br />
                            <span className="text-[#A51A1A]">EQUIPMENT RENTAL</span>
                          </h1>
                        </div>
                        <p className="text-base font-bold text-[#111113]/85 lowercase leading-relaxed">
                          Reliable Heavy Equipment Solutions for Construction, Industrial and Infrastructure Projects
                        </p>
                        <button className="btn-kampr-dark font-orbitron text-xs">
                          United Arab Emirates
                        </button>
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          poster="/logo.jpeg"
                          className="w-full h-full object-cover"
                        >
                          <source
                            src="/truck.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2: Company Profile */}
                  {currentSlide === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="p-8 rounded-3xl bg-[#A51A1A] text-white space-y-6 border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <h2 className="text-3xl font-black font-orbitron uppercase text-[#FF7C00]">COMPANY PROFILE</h2>
                        <p className="font-bold text-sm leading-relaxed lowercase">
                          {companyProfile.about}
                        </p>
                        <ul className="space-y-3 font-black text-sm text-[#FF7C00]">
                          {companyProfile.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FF7C00]" />
                              <span className="lowercase">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/company_excavator.jpg" alt="Excavator stormy sky" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 3: Mission & Vision */}
                  {currentSlide === 2 && (
                    <div className="flex flex-col gap-6 justify-between h-full">
                      <div className="h-[180px] w-full rounded-2xl overflow-hidden border-4 border-[#111113] relative">
                        <Image src="/images/forklift_warehouse.jpg" alt="Warehouse forklift" width={1200} height={900} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <h2 className="text-4xl font-black font-orbitron text-white tracking-widest uppercase">MISSION & VISION</h2>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                          <h3 className="text-lg font-black font-orbitron text-[#FF7C00] uppercase mb-2">OUR VISION</h3>
                          <p className="text-xs font-bold leading-relaxed lowercase">{companyProfile.vision}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                          <h3 className="text-lg font-black font-orbitron text-[#FF7C00] uppercase mb-2">OUR MISSION</h3>
                          <p className="text-xs font-bold leading-relaxed lowercase">{companyProfile.mission}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 4: What is Heavy Equipment */}
                  {currentSlide === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-black font-orbitron uppercase text-[#A51A1A]">WHAT IS HEAVY EQUIPMENT?</h2>
                          <p className="text-sm font-bold text-gray-500 lowercase mt-1">Machines designed to handle large and demanding tasks</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-3 items-start">
                            <Settings className="w-8 h-8 text-[#FF7C00] shrink-0" />
                            <p className="text-xs font-bold lowercase">Heavy equipment is used for construction and earth-moving work</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-3 items-start">
                            <Wrench className="w-8 h-8 text-[#FF7C00] shrink-0" />
                            <p className="text-xs font-bold lowercase">They are designed for strength and durability on any terrain</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-3 items-start">
                            <Layers className="w-8 h-8 text-[#FF7C00] shrink-0" />
                            <p className="text-xs font-bold lowercase">These machines help move soil, rocks, and materials quickly</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-3 items-start">
                            <Shield className="w-8 h-8 text-[#FF7C00] shrink-0" />
                            <p className="text-xs font-bold lowercase">They are commonly used in large UAE infrastructure projects</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/excavator_digging.jpg" alt="Excavator digging" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 5: Common Types */}
                  {currentSlide === 4 && (
                    <div className="flex flex-col justify-between h-full gap-4">
                      <div className="text-center">
                        <h2 className="text-2xl font-black font-orbitron uppercase text-[#A51A1A]">COMMON TYPES OF HEAVY EQUIPMENT</h2>
                        <p className="text-xs font-bold text-gray-500 lowercase">Different machines serve different construction tasks</p>
                      </div>
                      <div className="grid grid-cols-5 gap-3 flex-grow min-h-[280px]">
                        {columnsData.map((col, idx) => (
                          <div
                            key={idx}
                            className="group relative rounded-xl overflow-hidden border-2 border-[#111113] flex flex-col justify-between"
                          >
                            <Image src={col.img} alt={col.title} width={1200} height={900} className="absolute inset-0 w-full h-full object-cover z-0" />
                            <div className="absolute inset-0 bg-[#A51A1A]/85 z-10 p-3 flex flex-col justify-between text-white transition-opacity duration-300">
                              <h3 className="text-sm font-black font-orbitron uppercase tracking-wider text-[#FF7C00] border-b border-white/20 pb-1">{col.title}</h3>
                              <p className="text-[10px] font-bold leading-relaxed lowercase overflow-y-auto max-h-[160px] pr-1">{col.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 6: Why Heavy Equipment Matters */}
                  {currentSlide === 5 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-black font-orbitron uppercase text-[#A51A1A]">WHY HEAVY EQUIPMENT MATTERS</h2>
                          <p className="text-sm font-bold text-gray-500 lowercase mt-1">Machines that increase speed and efficiency</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border-4 border-[#111113] shadow-[4px_4px_0px_#111113] text-gray-700 font-bold leading-relaxed text-sm lowercase">
                          Heavy equipment plays an important role in construction projects. Without these machines, many tasks would take much longer to complete. Large equipment can move huge amounts of soil and materials in a short time. This helps construction teams work faster and complete projects more efficiently.
                        </div>
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/heavy_crane.jpg" alt="Heavy telescopic crane" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 7: Productivity Comparison */}
                  {currentSlide === 6 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-black font-orbitron uppercase text-[#A51A1A]">PRODUCTIVITY COMPARISON</h2>
                          <p className="text-sm font-bold text-gray-500 lowercase mt-1">Machines dramatically increase work efficiency</p>
                        </div>
                        <ProductivityChart />
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/wheel_shovel.jpg" alt="Wheel shovel working" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 8: Heavy Equipment Usage in Projects */}
                  {currentSlide === 7 && (
                    <div className="flex flex-col justify-between h-full gap-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-black font-orbitron uppercase text-[#111113]">HEAVY EQUIPMENT USAGE IN PROJECTS</h2>
                        <p className="text-xs font-bold text-gray-500 lowercase">Different machines are used for different tasks</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-center">
                        <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex items-center gap-4">
                          <span className="w-5 h-5 rounded-full bg-white shrink-0" />
                          <span className="font-orbitron font-black text-sm uppercase">Excavators are used for digging and trenching</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white text-[#111113] border-2 border-[#111113] flex items-center gap-4">
                          <span className="w-5 h-5 rounded-full bg-[#A51A1A] shrink-0" />
                          <span className="font-orbitron font-black text-sm uppercase">Wheel loaders move heavy materials</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[#A51A1A] text-white border-2 border-[#111113] flex items-center gap-4">
                          <span className="w-5 h-5 rounded-full bg-white shrink-0" />
                          <span className="font-orbitron font-black text-sm uppercase">Bulldozers clear and level site land</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white text-[#111113] border-2 border-[#111113] flex items-center gap-4">
                          <span className="w-5 h-5 rounded-full bg-[#A51A1A] shrink-0" />
                          <span className="font-orbitron font-black text-sm uppercase">UD Trucks transport machinery & aggregates</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 9: Types of Work Done */}
                  {currentSlide === 8 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-4">
                        <h2 className="text-2xl font-black font-orbitron uppercase text-[#A51A1A]">TYPES OF WORK DONE BY HEAVY EQUIPMENT</h2>
                        <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[4px_4px_0px_#111113] font-bold text-xs leading-relaxed lowercase">
                          Heavy equipment is essential for construction tasks such as excavating, transporting materials, and demolishing structures. Key machines like bulldozers, excavators, cranes, loaders, and dump trucks improve efficiency and organization on sites, crucial for paving roads, building bridges, and erecting structures safely and effectively.
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <WorkBreakdownChart />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 10: Operation Trends */}
                  {currentSlide === 9 && (
                    <div className="flex flex-col justify-between h-full gap-4">
                      <div className="text-center">
                        <h2 className="text-2xl font-black font-orbitron uppercase text-[#111113]">HEAVY EQUIPMENT OPERATION TRENDS</h2>
                      </div>
                      <div className="flex-grow flex items-center justify-center">
                        <OperationTrendsChart dark={false} />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 11: The Future of Heavy Equipment */}
                  {currentSlide === 10 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-black font-orbitron uppercase text-[#111113]">THE FUTURE OF HEAVY EQUIPMENT</h2>
                          <p className="text-sm font-bold text-gray-500 lowercase mt-1">Smarter machines for better construction</p>
                        </div>
                        <p className="text-gray-700 font-bold text-sm leading-relaxed lowercase">
                          Heavy equipment will continue to evolve in the future. New technologies are making machines safer, more efficient, and easier to operate. Modern equipment can help reduce fuel usage, improve safety, and support faster project completion. As construction projects grow larger, advanced machines will become even more important.
                        </p>
                      </div>
                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/loader_future.jpg" alt="Futuristic autonomous loader" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 12: Thank You / Contact */}
                  {currentSlide === 11 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full relative">
                      <div className="space-y-6 z-10">
                        <h2 className="text-4xl font-black font-orbitron uppercase text-[#A51A1A]">THANK YOU FOR YOUR ATTENTION</h2>

                        <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-4">
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <Mail className="w-5 h-5 text-[#FF7C00]" />
                            <span>alghazi478@gmail.com</span>
                          </div>
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <Globe className="w-5 h-5 text-[#FF7C00]" />
                            <span>www.truxorental.com</span>
                          </div>
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <Phone className="w-5 h-5 text-[#FF7C00]" />
                            <span>+971 50 675 8759</span>
                          </div>
                          <div className="flex items-center gap-3 font-bold text-sm">
                            <MapPin className="w-5 h-5 text-[#FF7C00]" />
                            <span>Ras Al Khaimah, UAE</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-full min-h-[250px] relative rounded-2xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113]">
                        <Image src="/images/loader_thankyou.jpg" alt="Loader at sunset" width={1200} height={900} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation Area */}
            <div className="p-6 border-t-2 border-[#111113] bg-[#F5F2EB]/50 flex justify-between items-center shrink-0">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="btn-kampr-dark px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {/* Dots Progress Indicator */}
              <div className="hidden md:flex gap-2">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3.5 h-3.5 rounded-full border border-[#111113] transition-all ${currentSlide === idx ? "bg-[#A51A1A] scale-125" : "bg-white hover:bg-gray-200"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="btn-kampr-dark px-4 py-2 text-xs flex items-center gap-2 disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD SCROLL VIEW                                                      */
        /* ========================================================================= */
        <div className="space-y-36 pb-24">

          {/* SECTION 1: Hero */}
          <section className="relative w-full min-h-[85vh] py-24 flex items-center overflow-hidden border-b-4 border-[#111113]">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/logo.jpeg"
                className="w-full h-full object-cover filter brightness-[0.35]"
              >
                <source
                  src="/truck.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-[#111113] via-[#111113]/80 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 md:space-y-8 text-white max-w-2xl mt-12 md:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111113]/50 border border-white/10 w-fit font-black uppercase text-xs tracking-[0.2em] text-[#FF7C00] backdrop-blur-md shadow-lg"
                >
                  <MapPin className="w-4 h-4" />
                  <span>United Arab Emirates</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black font-orbitron tracking-tight text-white uppercase leading-[1.05]"
                >
                  TRUXO HEAVY <br />
                  <span className="text-[#A51A1A] drop-shadow-xl sm:whitespace-nowrap block sm:inline mt-1 sm:mt-0">EQUIPMENT RENTAL</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg md:text-xl text-gray-200 font-semibold leading-relaxed max-w-xl"
                >
                  Reliable heavy equipment solutions for construction, industrial, and infrastructure projects across the UAE.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 pt-4 w-full sm:w-auto"
                >
                  <Link href="/fleet" className="btn-kampr-accent px-6 py-4 md:px-8 md:py-4 text-sm md:text-base shadow-[0_0_20px_rgba(255,124,0,0.3)] w-full sm:w-auto flex justify-center items-center">
                    Explore Fleet <ChevronRight className="w-5 h-5 ml-1 inline" />
                  </Link>
                  <Link href="/contact" className="px-6 py-4 md:px-8 md:py-4 rounded-full font-black border-2 border-white/50 text-white hover:bg-white hover:text-[#111113] transition-all duration-300 text-xs md:text-sm uppercase tracking-widest backdrop-blur-sm w-full sm:w-auto text-center flex justify-center items-center">
                    Request Quote
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Company Profile */}
          <section className="bg-[#A51A1A] py-24 text-white border-y-4 border-[#111113]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#FF7C00] font-orbitron">ABOUT OUR COMPANY</h2>
                <h3 className="text-5xl md:text-6xl font-black font-orbitron uppercase leading-none">COMPANY PROFILE</h3>
                <p className="text-lg font-bold text-gray-200 leading-relaxed lowercase">
                  {companyProfile.about}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-black text-sm text-[#FF7C00]">
                  {companyProfile.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#FF7C00]" />
                      <span className="lowercase">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-3xl overflow-hidden border-4 border-[#111113] shadow-[8px_8px_0px_#111113]">
                <Image src="/images/company_excavator.jpg" alt="Tracked excavator" width={1200} height={900} className="w-full h-full object-cover aspect-[4/3]" />
              </div>
            </div>
          </section>

          {/* SECTION 3: Mission & Vision */}
          <section className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="relative h-[300px] w-full rounded-3xl overflow-hidden border-4 border-[#111113] shadow-[8px_8px_0px_#111113]">
              <Image src="/images/forklift_warehouse.jpg" alt="Forklift inside warehouse" width={1200} height={900} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/55 flex flex-col justify-center items-center text-center p-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#FF7C00] font-orbitron mb-3">Our Core Philosophy</h2>
                <h3 className="text-5xl md:text-6xl font-black font-orbitron text-white uppercase tracking-tight">MISSION & VISION</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[6px_6px_0px_#111113]">
                <h4 className="text-2xl font-black font-orbitron text-[#FF7C00] uppercase mb-4">OUR VISION</h4>
                <p className="text-base font-bold leading-relaxed lowercase">{companyProfile.vision}</p>
              </div>
              <div className="p-8 rounded-3xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[6px_6px_0px_#111113]">
                <h4 className="text-2xl font-black font-orbitron text-[#FF7C00] uppercase mb-4">OUR MISSION</h4>
                <p className="text-base font-bold leading-relaxed lowercase">{companyProfile.mission}</p>
              </div>
            </div>
          </section>

          {/* SECTION 4: What is Heavy Equipment? */}
          <section className="bg-[#111113] py-24 text-white border-y-4 border-[#111113]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#A51A1A] font-orbitron">WHAT IS HEAVY EQUIPMENT?</h2>
                <h3 className="text-5xl font-black font-orbitron uppercase text-white leading-none">
                  MACHINES DESIGNED FOR DEMANDING TASKS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-4 items-start">
                    <Settings className="w-10 h-10 text-[#FF7C00] shrink-0" />
                    <p className="text-sm font-bold lowercase">Heavy equipment is used for construction and earth-moving work</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-4 items-start">
                    <Wrench className="w-10 h-10 text-[#FF7C00] shrink-0" />
                    <p className="text-sm font-bold lowercase">They are designed for strength and durability on any terrain</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-4 items-start">
                    <Layers className="w-10 h-10 text-[#FF7C00] shrink-0" />
                    <p className="text-sm font-bold lowercase">These machines help move soil, rocks, and materials quickly</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#A51A1A] text-white border-2 border-[#111113] flex gap-4 items-start">
                    <Shield className="w-10 h-10 text-[#FF7C00] shrink-0" />
                    <p className="text-sm font-bold lowercase">They are commonly used in large UAE infrastructure projects</p>
                  </div>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/20 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
                <Image src="/images/excavator_digging.jpg" alt="Excavator digging gravel" width={1200} height={900} className="w-full h-full object-cover aspect-[4/3]" />
              </div>
            </div>
          </section>

          {/* SECTION 5: Common Types */}
          <section className="max-w-7xl mx-auto px-6 space-y-16">
            <div className="text-center">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A51A1A] font-orbitron mb-3">COMMON TYPES OF HEAVY EQUIPMENT</h2>
              <h3 className="text-5xl md:text-6xl font-black font-orbitron uppercase text-[#111113] tracking-tight">OUR FLLET SEGMENTS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {columnsData.map((col, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden border-4 border-[#111113] shadow-[4px_4px_0px_#111113] aspect-[2/3] flex flex-col justify-end"
                >
                  <Image src={col.img} alt={col.title} width={1200} height={900} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 z-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                  <div className="relative z-20 p-6 text-white space-y-3">
                    <h4 className="text-xl font-black font-orbitron text-[#FF7C00] uppercase border-b border-white/20 pb-2">{col.title}</h4>
                    <p className="text-xs font-bold leading-relaxed lowercase text-gray-200 line-clamp-4">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: Why Heavy Equipment Matters */}
          <section className="relative py-32 px-6 overflow-hidden border-y-4 border-[#111113]">
            <div className="absolute inset-0 z-0">
              <Image src="/images/heavy_crane.jpg" alt="Crane backdrop" width={1200} height={900} className="w-full h-full object-cover filter brightness-[0.3]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#A51A1A]/80 to-transparent" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
              <div className="space-y-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#FF7C00] font-orbitron">SPEED & EFFICIENCY</h2>
                <h3 className="text-5xl md:text-6xl font-black font-orbitron uppercase leading-none">WHY HEAVY EQUIPMENT MATTERS</h3>
                <p className="text-lg font-bold leading-relaxed lowercase text-gray-200">
                  Heavy equipment plays an important role in construction projects. Without these machines, many tasks would take much longer to complete. Large equipment can move huge amounts of soil and materials in a short time. This helps construction teams work faster and complete projects more efficiently.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7: Productivity Comparison */}
          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A51A1A] font-orbitron">CAPACITY METRICS</h2>
              <h3 className="text-5xl font-black font-orbitron uppercase text-[#111113]">PRODUCTIVITY COMPARISON</h3>
              <p className="text-lg text-gray-500 font-bold lowercase">
                How utilizing heavy machinery increases output speed over traditional manual labor.
              </p>
              <ProductivityChart />
            </div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-[#111113] shadow-[8px_8px_0px_#111113]">
              <Image src="/images/wheel_shovel.jpg" alt="Front wheel shovel loader" width={1200} height={900} className="w-full h-full object-cover aspect-[4/3]" />
            </div>
          </section>

          {/* SECTION 8: Heavy Equipment Usage in Projects */}
          <section className="bg-[#111113] py-24 text-white border-y-4 border-[#111113]">
            <div className="max-w-7xl mx-auto px-6 space-y-16">
              <div className="text-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#FF7C00] font-orbitron mb-3">OPERATIONAL INTEGRATION</h2>
                <h3 className="text-5xl font-black font-orbitron uppercase tracking-tight text-white">USAGE IN PROJECTS</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[6px_6px_0px_rgba(255,255,255,0.15)] flex items-center gap-6">
                  <span className="w-6 h-6 rounded-full bg-white shrink-0" />
                  <span className="font-orbitron font-black text-lg uppercase">Excavators are used for digging and trenching</span>
                </div>
                <div className="p-6 rounded-3xl bg-white text-[#111113] border-4 border-[#111113] shadow-[6px_6px_0px_rgba(0,0,0,0.15)] flex items-center gap-6">
                  <span className="w-6 h-6 rounded-full bg-[#A51A1A] shrink-0" />
                  <span className="font-orbitron font-black text-lg uppercase">Wheel loaders move heavy materials</span>
                </div>
                <div className="p-6 rounded-3xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[6px_6px_0px_rgba(255,255,255,0.15)] flex items-center gap-6">
                  <span className="w-6 h-6 rounded-full bg-white shrink-0" />
                  <span className="font-orbitron font-black text-lg uppercase">Bulldozers clear and level site land</span>
                </div>
                <div className="p-6 rounded-3xl bg-white text-[#111113] border-4 border-[#111113] shadow-[6px_6px_0px_rgba(0,0,0,0.15)] flex items-center gap-6">
                  <span className="w-6 h-6 rounded-full bg-[#A51A1A] shrink-0" />
                  <span className="font-orbitron font-black text-lg uppercase">UD Trucks transport machinery & aggregates</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: Types of Work Done */}
          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A51A1A] font-orbitron">WORK BREAKDOWN</h2>
              <h3 className="text-5xl font-black font-orbitron uppercase text-[#111113]">TYPES OF WORK DONE</h3>
              <p className="text-lg text-gray-500 font-bold lowercase">
                A simple breakdown of construction activities and core tasks done by heavy equipment.
              </p>
              <div className="p-8 rounded-3xl bg-[#A51A1A] text-white border-4 border-[#111113] shadow-[8px_8px_0px_#111113] font-bold text-sm leading-relaxed lowercase">
                Heavy equipment is essential for construction tasks such as excavating, transporting materials, and demolishing structures. Key machines like bulldozers, excavators, cranes, loaders, and dump trucks improve efficiency and organization on sites, crucial for paving roads, building bridges, and erecting structures safely and effectively.
              </div>
            </div>
            <div className="flex justify-center">
              <WorkBreakdownChart />
            </div>
          </section>

          {/* SECTION 10: Operation Trends */}
          <section className="bg-[#111113] py-24 text-white border-y-4 border-[#111113]">
            <div className="max-w-5xl mx-auto px-6 space-y-12">
              <div className="text-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#FF7C00] font-orbitron mb-3">ACTIVITY PHASES</h2>
                <h3 className="text-5xl font-black font-orbitron uppercase tracking-tight text-white">OPERATION TRENDS</h3>
              </div>
              <OperationTrendsChart dark={true} />
            </div>
          </section>

          {/* SECTION 11: The Future of Heavy Equipment */}
          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A51A1A] font-orbitron">THE FUTURE OF HEAVY EQUIPMENT</h2>
              <h3 className="text-5xl font-black font-orbitron uppercase text-[#111113]">SMARTER MACHINES FOR BETTER BUILD</h3>
              <p className="text-lg font-bold text-gray-600 leading-relaxed lowercase">
                Heavy equipment will continue to evolve in the future. New technologies are making machines safer, more efficient, and easier to operate. Modern equipment can help reduce fuel usage, improve safety, and support faster project completion. As construction projects grow larger, advanced machines will become even more important.
              </p>

              <div className="space-y-4 font-bold text-[#111113]">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-[#A51A1A] stroke-[3]" />
                  <span>Autonomous navigation and sensor safety</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-[#A51A1A] stroke-[3]" />
                  <span>Hybrid and electric clean power platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-[#A51A1A] stroke-[3]" />
                  <span>Live telemetry and fleet diagnostic monitoring</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border-4 border-[#111113] shadow-[8px_8px_0px_#111113]">
              <Image src="/images/loader_future.jpg" alt="Autonomous hybrid wheel loader" width={1200} height={900} className="w-full h-full object-cover aspect-[4/3]" />
            </div>
          </section>

          {/* SECTION 12: Thank You / Contact details */}
          <section className="relative py-32 px-6 overflow-hidden border-t-4 border-[#111113]">
            <div className="absolute inset-0 z-0">
              <Image src="/images/loader_thankyou.jpg" alt="Loader at sunset" width={1200} height={900} className="w-full h-full object-cover filter brightness-[0.3]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-6xl font-black font-orbitron uppercase text-[#FF7C00]">
                  THANK YOU FOR YOUR ATTENTION
                </h2>
                <p className="text-xl font-bold lowercase text-gray-300 leading-relaxed">
                  We look forward to partnering with you on your next UAE build. Contact our support team today for rental rates and mobilization schedules.
                </p>

                <div className="p-8 rounded-3xl bg-[#A51A1A] border-4 border-[#111113] shadow-[8px_8px_0px_#111113] grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center gap-3 font-bold">
                    <Mail className="w-6 h-6 text-[#FF7C00]" />
                    <span>alghazi478@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 font-bold">
                    <Globe className="w-6 h-6 text-[#FF7C00]" />
                    <span>www.truxorental.com</span>
                  </div>
                  <div className="flex items-center gap-3 font-bold">
                    <Phone className="w-6 h-6 text-[#FF7C00]" />
                    <span>+971 50 675 8759</span>
                  </div>
                  <div className="flex items-center gap-3 font-bold">
                    <MapPin className="w-6 h-6 text-[#FF7C00]" />
                    <span>Al Ghail, Ras Al Khaimah, UAE</span>
                  </div>
                </div>

                <div>
                  <Link href="/contact" className="btn-kampr-accent">
                    Contact Us Now
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </main>
  );
}
