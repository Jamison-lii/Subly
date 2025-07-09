'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#007A5E] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#007A5E] transition-colors duration-300">Subly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-[#007A5E] transition-all duration-300 relative group">
              Features
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#007A5E] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-[#007A5E] transition-all duration-300 relative group">
              How it Works
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#007A5E] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-[#007A5E] transition-all duration-300 relative group">
              Pricing
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#007A5E] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-[#007A5E] transition-all duration-300 relative group">
              Login
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#007A5E] group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-[#007A5E] text-white px-4 py-2 rounded-lg hover:bg-[#006B52] transition-all duration-300 font-medium hover-lift focus-ring"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#007A5E] hover:bg-gray-100 transition-all duration-300 focus-ring"
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            <Link 
              href="#features" 
              className="block px-3 py-2 text-gray-600 hover:text-[#007A5E] transition-all duration-300 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="block px-3 py-2 text-gray-600 hover:text-[#007A5E] transition-all duration-300 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="#pricing" 
              className="block px-3 py-2 text-gray-600 hover:text-[#007A5E] transition-all duration-300 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/auth/login" 
              className="block px-3 py-2 text-gray-600 hover:text-[#007A5E] transition-all duration-300 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/auth/signup"
              className="block px-3 py-2 bg-[#007A5E] text-white rounded-lg hover:bg-[#006B52] transition-all duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 