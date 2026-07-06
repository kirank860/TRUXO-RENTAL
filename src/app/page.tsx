"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { Shield, ChevronRight, HardHat, Settings, Truck } from "lucide-react";

// A dynamic abstract 3D shape representing strength and engineering
function AbstractMachineShape() {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#A51A1A"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

const equipments = [
  { name: "Forklift", desc: "Reliable forklifts for warehousing and material handling", icon: <Truck className="w-8 h-8" /> },
  { name: "JCB Loader", desc: "Versatile JCB loaders for earthmoving and infrastructure", icon: <HardHat className="w-8 h-8" /> },
  { name: "Crane", desc: "Heavy-duty cranes for construction projects", icon: <Settings className="w-8 h-8" /> },
  { name: "Telehandler", desc: "Versatile telehandlers for lifting and material placement", icon: <Shield className="w-8 h-8" /> },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-brand-red" />
            <span className="font-bold text-2xl tracking-tighter">TRUXO</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#home" className="hover:text-white transition">Home</a>
            <a href="#fleet" className="hover:text-white transition">Equipment Fleet</a>
            <a href="#industries" className="hover:text-white transition">Industries</a>
            <button className="bg-brand-red text-white px-6 py-2 rounded-full hover:bg-red-700 transition">
              Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center pt-20 overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#A51A1A" />
            <AbstractMachineShape />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Trusted UAE Provider</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]">
              POWERING YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-500">
                PROJECTS.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
              Reliable, safe, and cost-effective heavy equipment rental solutions for construction, industrial, and infrastructure projects across the Emirates.
            </p>
            
            <div className="flex items-center gap-4">
              <button className="bg-brand-red text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition shadow-[0_0_20px_rgba(165,26,26,0.4)]">
                View Fleet <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/5 transition">
                Request Quote
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Equipment Fleet Section */}
      <section id="fleet" className="py-32 relative bg-brand-dark/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Premium Fleet</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Modern, well-maintained equipment featuring diesel and electric forklifts, mobile cranes, JCB backhoes, and heavy-duty excavators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipments.map((eq, i) => (
              <motion.div
                key={eq.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-red/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-red/20 to-transparent flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
                  {eq.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{eq.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{eq.desc}</p>
                
                <div className="mt-8 flex items-center text-sm font-medium text-brand-red opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-red/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
            READY TO BUILD?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Get reliable heavy equipment and material handling solutions tailored to your project timeline and budget requirements.
          </p>
          <button className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Contact Us Today
          </button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-sm text-gray-500">
        <p>© 2026 TRUXO HEAVY EQUIPMENT RENTAL. All rights reserved. | UAE</p>
      </footer>
    </main>
  );
}
