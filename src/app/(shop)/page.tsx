import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
          Suku Cadang Motor Berkualitas
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Temukan berbagai suku cadang motor original dengan harga terjangkau.
          Pengiriman cepat ke seluruh Indonesia.
        </p>
        <Link
          href="/produk"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          Lihat Produk
        </Link>
      </div>
    </div>
  );
}
