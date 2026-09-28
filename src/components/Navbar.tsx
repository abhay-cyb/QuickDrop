"use client";
import { CloudLightning } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <CloudLightning className="w-8 h-8 text-[#8b5cf6]" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">
              QuickDrop
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
