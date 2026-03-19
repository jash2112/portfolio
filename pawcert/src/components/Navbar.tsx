'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, PawPrint, ChevronDown } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
            <PawPrint className="w-6 h-6 text-brand-600" />
            PawCert
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/courses" className="btn-ghost text-sm">Browse Courses</Link>
            <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
            <Link href="/#how-it-works" className="btn-ghost text-sm">How It Works</Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-gray-600 font-medium hover:text-brand-700 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
              Get Certified Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          <Link href="/courses" className="block py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>Browse Courses</Link>
          <Link href="/pricing" className="block py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/#how-it-works" className="block py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>How It Works</Link>
          <hr className="border-gray-100" />
          <Link href="/auth/signin" className="block py-2 text-gray-600" onClick={() => setOpen(false)}>Sign In</Link>
          <Link href="/auth/signup" className="btn-primary w-full text-sm" onClick={() => setOpen(false)}>Get Certified Free</Link>
        </div>
      )}
    </nav>
  )
}
