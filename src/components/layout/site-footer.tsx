"use client";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-secondary mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3">Tentang</h3>
            <p className="text-sm text-muted-foreground">
              Menyediakan suku cadang motor original dengan harga kompetitif.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Layanan</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Pengiriman cepat</li>
              <li>Garansi keaslian</li>
              <li>Konsultasi gratis</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Kontak</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Email: info@tokopartmotor.id</li>
              <li>Telepon: 0812-3456-7890</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            Harga dan kecocokan part adalah data contoh.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2026 Toko Part Motor. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
