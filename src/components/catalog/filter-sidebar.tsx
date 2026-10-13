"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehiclePicker } from "./vehicle-picker";

interface Model {
  id: string;
  name: string;
  slug: string;
  variants: Array<{ id: string; name: string; yearFrom: number; yearTo: number | null }>;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  models: Model[];
}

interface FilterSidebarProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    children: Array<{ id: string; name: string; slug: string }>;
  }>;
  vehicleTree: Brand[];
}

export function FilterSidebar({
  categories,
  vehicleTree,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug === null) return;
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (sort: string | null) => {
    if (sort === null) return;
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Cari</Label>
        <Input
          type="text"
          placeholder="Nama atau part number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          className="text-sm h-8"
        />
      </form>

      <div className="border-t border-border pt-6" />

      {/* Vehicle Picker */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Pilih Motor</h3>
        <VehiclePicker tree={vehicleTree} />
      </div>

      <div className="border-t border-border pt-6" />

      {/* Category */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Kategori</Label>
        <Select
          value={searchParams.get("category") || ""}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua kategori</SelectItem>
            {categories.map((cat) => (
              <div key={cat.id}>
                <SelectItem value={cat.slug} className="font-medium">
                  {cat.name}
                </SelectItem>
                {cat.children.map((child) => (
                  <SelectItem key={child.id} value={child.slug} className="pl-4">
                    {child.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t border-border pt-6" />

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Urutan</Label>
        <Select
          value={searchParams.get("sort") || ""}
          onValueChange={handleSortChange}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Terbaru" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Terbaru</SelectItem>
            <SelectItem value="price_asc">Harga: Rendah ke Tinggi</SelectItem>
            <SelectItem value="price_desc">Harga: Tinggi ke Rendah</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
