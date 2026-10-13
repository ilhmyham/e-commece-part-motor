"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Variant {
  id: string;
  name: string;
  yearFrom: number;
  yearTo: number | null;
}

interface Model {
  id: string;
  name: string;
  slug: string;
  variants: Variant[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  models: Model[];
}

export function VehiclePicker({ tree }: { tree: Brand[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variantId = searchParams.get("variant");

  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("");
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  const selectedBrand = tree.find((b) => b.slug === selectedBrandSlug);
  const selectedModel = selectedBrand?.models.find(
    (m) => m.slug === selectedModelSlug
  );

  // Parse variant from URL to show initial brand/model
  if (variantId && !selectedBrandSlug) {
    const variant = tree
      .flatMap((b) => b.models.flatMap((m) => m.variants.map((v) => ({...v, modelSlug: m.slug, brandSlug: b.slug}))))
      .find((v) => v.id === variantId);
    if (variant) {
      setSelectedBrandSlug(variant.brandSlug);
      setSelectedModelSlug(variant.modelSlug);
      setSelectedVariantId(variantId);
    }
  }

  const handleVariantSelect = (vId: string | null) => {
    if (!vId) return;
    const params = new URLSearchParams(searchParams);
    params.set("variant", vId);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setSelectedVariantId(vId);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("variant");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setSelectedBrandSlug("");
    setSelectedModelSlug("");
    setSelectedVariantId("");
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Pilih Motor</h3>
      <Select
        value={selectedBrandSlug}
        onValueChange={(v) => v && setSelectedBrandSlug(v)}
      >
        <SelectTrigger size="sm">
          <SelectValue placeholder="Merek" />
        </SelectTrigger>
        <SelectContent>
          {tree.map((brand) => (
            <SelectItem key={brand.id} value={brand.slug}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedBrand && (
        <Select
          value={selectedModelSlug}
          onValueChange={(v) => v && setSelectedModelSlug(v)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            {selectedBrand.models.map((model) => (
              <SelectItem key={model.id} value={model.slug}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedModel && (
        <Select value={selectedVariantId} onValueChange={handleVariantSelect}>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Varian" />
          </SelectTrigger>
          <SelectContent>
            {selectedModel.variants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id}>
                {variant.name} ({variant.yearFrom}
                {variant.yearTo ? `–${variant.yearTo}` : "–sekarang"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {variantId && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Hapus pilihan motor
        </Button>
      )}
    </div>
  );
}
