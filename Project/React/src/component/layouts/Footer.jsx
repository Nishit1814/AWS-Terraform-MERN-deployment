
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-24 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/20">T</div>
              <span className="text-2xl font-black text-white tracking-tighter">TripPlanner <span className="text-indigo-500">AI</span></span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              Architecting the future of travel. We merge artificial intelligence with regional expertise to curate journeys that nourish the soul and ignite the spirit of adventure.
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 relative">
              Platform
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-indigo-600 rounded-full" />
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/login" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Join Group Tours</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">Global Destinations</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">AI Itinerary Engine</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-all hover:translate-x-1 inline-block">My Journey Log</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 relative">
              Support
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-emerald-500 rounded-full" />
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><a href="/contact" className="hover:text-emerald-400 transition-all hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition-all hover:translate-x-1 inline-block">Safety Protocols</a></li>
              <li><a href="/login" className="hover:text-emerald-400 transition-all hover:translate-x-1 inline-block">Booking Terms</a></li>
              <li><a href="/privacy-policy" className="hover:text-emerald-400 transition-all hover:translate-x-1 inline-block">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 relative">
              Contact Us
              <span className="absolute -bottom-3 left-0 w-8 h-1 bg-rose-500 rounded-full" />
            </h4>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-indigo-600/10 group-hover:border-indigo-600/30 transition-all">📧</span>
                <div>
                  <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">Email Support</p>
                  <a href="mailto:hello@tripplanner.ai" className="hover:text-indigo-400 transition-colors font-bold break-all">hello@tripplanner.ai</a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-emerald-600/10 group-hover:border-emerald-600/30 transition-all">📞</span>
                <div>
                  <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="font-bold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <span className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-rose-600/10 group-hover:border-rose-600/30 transition-all">📍</span>
                <div>
                  <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">HQ Region</p>
                  <p className="font-bold">Gandhinagar, Gujarat, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-700">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Global Nodes Online</span>
            </div>
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              &copy; 2026 TripPlanner AI Engineering Group.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-700">
            
            <span>Uptime 99.9%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
