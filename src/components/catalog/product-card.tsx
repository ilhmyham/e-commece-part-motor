import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format";
import { ImageOff } from "lucide-react";
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
    <a href={`/produk/${slug}`} className="group">
      <Card className="overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer h-full flex flex-col">
        <div className="relative w-full aspect-square bg-muted flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              className="object-cover group-hover:opacity-90 transition-opacity"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageOff className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col gap-3 flex-grow flex-col justify-between">
          <div className="flex flex-col gap-2 flex-grow">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {brand}
            </p>
            <h3 className="text-sm font-medium line-clamp-2 leading-snug">{name}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-base font-bold text-primary">
              {formatRupiah(price)}
            </div>
            {fitmentVariant && (
              <Badge variant="secondary" className="w-fit text-xs">
                Cocok untuk {fitmentVariant}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
