import { requireUser } from "@/lib/auth-helpers";
import Link from "next/link";

export const metadata = {
  title: "Akun Saya",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Akun Saya</h1>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-medium capitalize">
                {user.role === "admin" ? "Admin" : "Pelanggan"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="text-primary hover:underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
