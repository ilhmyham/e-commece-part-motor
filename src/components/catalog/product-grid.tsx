"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  imageAlt: string | null;
  slug: string;
}

interface ProductGridProps {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  fitmentVariantName?: string;
}

export function ProductGrid({
  products,
  total,
  page,
  pageSize,
  fitmentVariantName,
}: ProductGridProps) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const createPageLink = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    return `?${params.toString()}`;
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Tidak ada produk ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Product count */}
      <p className="text-sm text-muted-foreground">
        Menampilkan {products.length} dari {total} produk
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            fitmentVariant={fitmentVariantName}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
          {page > 1 && (
            <a href={createPageLink(page - 1)}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
            </a>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
            .map((p, i, arr) => {
              if (i > 0 && arr[i - 1] !== p - 1) {
                return (
                  <span key={`dots-${p}`} className="text-muted-foreground">
                    ...
                  </span>
                );
              }
              return (
                <a key={p} href={createPageLink(p)}>
                  <Button
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8"
                  >
                    {p}
                  </Button>
                </a>
              );
            })}

          {page < totalPages && (
            <a href={createPageLink(page + 1)}>
              <Button variant="outline" size="sm">
                Berikutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
