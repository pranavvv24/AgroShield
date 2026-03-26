"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Farmer App" },
  { href: "/pool-dashboard", label: "Pool Dashboard" },
  { href: "/admin", label: "Admin View" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-forest-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">AgroShield</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden rounded-md p-2 text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-forest-500 px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
