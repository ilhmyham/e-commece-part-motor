"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { HeaderClient } from "./header-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null | undefined;
}

export function SiteHeaderClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/get-session", {
          credentials: "include",
        });
       if (res.ok) {
  const data = await res.json();
  // Gunakan tanda tanya (?) agar aman. 
  // Jika data null, ia akan mengembalikan null/undefined tanpa memicu error.
  setUser(data?.user || null); 
}
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <button className="p-2 hover:bg-secondary rounded-md" aria-label="Keranjang">
            <ShoppingCart className="w-5 h-5" />
          </button>
          {!loading && user ? (
            <HeaderClient user={user} />
          ) : (
            <Link
              href="/masuk"
              className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 hover:bg-secondary rounded-md ml-2"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

