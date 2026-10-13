import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ImageOff } from "lucide-react";
import { getProductBySlug, isProductFitVariant } from "@/server/queries/products";
import { getVehicleTree } from "@/server/queries/vehicles";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehiclePicker } from "@/components/catalog/vehicle-picker";

export const instant = false;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
  props: ProductDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description || `Beli ${product.name} di Toko Part Motor`,
  };
}

export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const variantId = searchParams.variant
    ? Array.isArray(searchParams.variant)
      ? searchParams.variant[0]
      : searchParams.variant
    : null;

  let variantFits = false;
  let variantName: string | null = null;

  if (variantId) {
    const vehicleTree = await getVehicleTree();
    variantFits = await isProductFitVariant(product.id, variantId);

    if (variantFits) {
      const variant = vehicleTree
        .flatMap((b) =>
          b.models.flatMap((m) =>
            m.variants.map((v) => ({ ...v, modelName: m.name }))
          )
        )
        .find((v) => v.id === variantId);
      if (variant) {
        variantName = `${variant.modelName} ${variant.name}`;
      }
    }
  }

  const sortedImages = product.images.sort((a, b) => a.sortOrder - b.sortOrder);
  const mainImage = sortedImages[0] || null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
          <Link href="/produk" className="hover:text-foreground transition-colors">
            Produk
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/produk?category=${product.categorySlug || ""}`}
            className="hover:text-foreground transition-colors"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {mainImage?.url ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-12 h-12 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {sortedImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square bg-muted rounded-md overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-4">
              <div className="text-3xl font-bold text-primary">
                {formatRupiah(product.price)}
              </div>
              {isOutOfStock ? (
                <Badge variant="destructive">Stok Habis</Badge>
              ) : (
                <Badge variant="secondary">Stok: {product.stock}</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-sm font-semibold mb-2">Deskripsi</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* SKU & Part Number */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.sku && (
                <div>
                  <p className="text-muted-foreground">SKU</p>
                  <p className="font-mono">{product.sku}</p>
                </div>
              )}
              {product.partNumber && (
                <div>
                  <p className="text-muted-foreground">Part Number</p>
                  <p className="font-mono">{product.partNumber}</p>
                </div>
              )}
            </div>

            {/* Vehicle Picker & Fitment */}
            <div className="border-t pt-6">
              <h2 className="text-sm font-semibold mb-4">Pilih Motor</h2>
              <VehiclePicker tree={await getVehicleTree()} />

              {variantId && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  {variantFits ? (
                    <div className="flex items-start gap-2">
                      <Badge variant="default" className="mt-0.5 flex-shrink-0">
                        ✓
                      </Badge>
                      <span className="text-foreground">
                        Cocok untuk <strong>{variantName}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                        ?
                      </Badge>
                      <span className="text-muted-foreground">
                        Belum terdata cocok untuk motor ini
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              disabled
              size="lg"
              className="w-full"
              title={isOutOfStock ? "Stok habis" : "Fitur segera hadir"}
            >
              {isOutOfStock ? "Stok Habis" : "Segera Hadir"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
