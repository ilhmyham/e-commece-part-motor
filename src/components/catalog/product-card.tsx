import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  imageAlt: string | null;
  fitmentVariant?: string;
  slug: string;
}

export function ProductCard({
  name,
  brand,
  price,
  imageUrl,
  imageAlt,
  fitmentVariant,
  slug,
}: ProductCardProps) {
  return (
    <a href={`/produk/${slug}`}>
      <Card className="overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer h-full">
        <div className="relative w-full aspect-square bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Tidak ada gambar</span>
            </div>
          )}
        </div>
        <CardContent className="p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {brand}
            </p>
            <h3 className="text-sm font-medium line-clamp-2">{name}</h3>
          </div>
          <div className="text-base font-semibold text-primary">
            {formatRupiah(price)}
          </div>
          {fitmentVariant && (
            <Badge variant="secondary" className="w-fit text-xs">
              Cocok untuk {fitmentVariant}
            </Badge>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
