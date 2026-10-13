"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold tracking-tight text-lg">
          Toko Part Motor
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6 items-center">
          <Link href="/produk" className="text-sm hover:text-primary">
            Produk
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-secondary rounded-md">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary">
            Masuk
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 hover:bg-secondary rounded-md ml-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
            <Link href="/produk" className="text-sm py-2 hover:text-primary">
              Produk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
