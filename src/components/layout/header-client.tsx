"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

interface HeaderClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null | undefined;
  };
}

export function HeaderClient({ user }: HeaderClientProps) {
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Berhasil keluar");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
            {user.email}
          </div>
          <Link
            href="/akun"
            className="block px-4 py-2 text-sm hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            Akun saya
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
