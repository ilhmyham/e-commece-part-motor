"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilterSidebar } from "./filter-sidebar";
import { Sliders } from "lucide-react";

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

interface Category {
  id: string;
  name: string;
  slug: string;
  children: Array<{ id: string; name: string; slug: string }>;
}

interface FilterDialogProps {
  categories: Category[];
  vehicleTree: Brand[];
}

export function FilterDialog({
  categories,
  vehicleTree,
}: FilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 1. Tombol diletakkan di luar Dialog, gunakan onClick biasa */}
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Sliders className="w-4 h-4" />
        Filter
      </Button>

      {/* 2. Dialog hanya membungkus konten popup saja */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Filter Produk</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            <FilterSidebar categories={categories} vehicleTree={vehicleTree} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

}
