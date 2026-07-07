import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#12131A] text-[#F5F2EB] pt-24 pb-12 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-9 h-9 text-[#C5A059]" />
            <span className="font-orbitron font-black text-2xl tracking-widest text-white uppercase">truxo</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed lowercase font-medium">
            your trusted partner for reliable heavy equipment and material handling solutions across the uae.
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[#C5A059] font-orbitron font-bold text-sm uppercase tracking-wider">quick links</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-bold lowercase">
            <li><Link href="/fleet" className="hover:text-[#C5A059] transition-colors">our fleet</Link></li>
            <li><Link href="/services" className="hover:text-[#C5A059] transition-colors">services</Link></li>
            <li><Link href="/industries" className="hover:text-[#C5A059] transition-colors">industries</Link></li>
            <li><Link href="/contact" className="hover:text-[#C5A059] transition-colors">contact us</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[#C5A059] font-orbitron font-bold text-sm uppercase tracking-wider">contact details</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-bold">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#A51A1A]" />
              <span>+971 50 675 8759</span>
            </li>
            <li className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-[#A51A1A] opacity-60" />
              <span>055 598 2149 | 055 854 7497</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#A51A1A]" />
              <span className="lowercase">alghazi478@gmail.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[#C5A059] font-orbitron font-bold text-sm uppercase tracking-wider">location</h4>
          <p className="text-sm text-gray-400 leading-relaxed font-bold lowercase flex items-start gap-2">
            <MapPin className="w-5 h-5 text-[#A51A1A] shrink-0" />
            <span>
              shop no. 05, sheikh mohammed bin zayed st.,<br />
              al ghail, ras al khaimah, uae
            </span>
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-bold tracking-wider uppercase font-orbitron">
        <p>© 2026 truxo heavy equipment rental. all rights reserved.</p>
      </div>
    </footer>
  );
}
