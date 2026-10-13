// Seed data katalog: brand -> model -> varian, kategori, produk, lalu fitment.
// Idempotent: seluruh tabel katalog dikosongkan dulu, lalu diisi ulang dalam satu transaksi.
// Tabel auth & commerce tidak dihapus langsung. Catatan: menghapus product memicu FK commerce
// (cart_item ikut terhapus, order_item.product_id jadi NULL). Aman untuk DB dev.

import { randomUUID } from "node:crypto";
import { isNotNull } from "drizzle-orm";
import { db } from "../index";
import {
  category,
  motorcycleBrand,
  motorcycleModel,
  motorcycleVariant,
  product,
  productFitment,
} from "../schema";
import { categories } from "./data/categories";
import { products } from "./data/products";
import { vehicles } from "./data/vehicles";

type NewBrand = typeof motorcycleBrand.$inferInsert;
type NewModel = typeof motorcycleModel.$inferInsert;
type NewVariant = typeof motorcycleVariant.$inferInsert;
type NewCategory = typeof category.$inferInsert;
type NewProduct = typeof product.$inferInsert;
type NewFitment = typeof productFitment.$inferInsert;

async function main() {
  // Script ini menghapus data katalog, jadi jangan pernah dijalankan di produksi.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Seed ditolak: NODE_ENV=production. Script ini menghapus seluruh data katalog."
    );
  }

  const errors: string[] = [];

  const brandRows: NewBrand[] = [];
  const modelRows: NewModel[] = [];
  const variantRows: NewVariant[] = [];
  const parentRows: NewCategory[] = [];
  const leafRows: NewCategory[] = [];
  const productRows: NewProduct[] = [];
  const fitmentRows: NewFitment[] = [];

  const brandIdBySlug = new Map<string, string>();
  const modelIdBySlug = new Map<string, string>();
  const variantIdByKey = new Map<string, string>(); // `${model.slug}-${yearFrom}`
  const variantIdsByModelSlug = new Map<string, string[]>();
  const categoryIdBySlug = new Map<string, string>();
  const productIdBySku = new Map<string, string>();

  // ---------- Brand -> model -> varian ----------
  for (const b of vehicles) {
    const brandId = randomUUID();
    brandIdBySlug.set(b.slug, brandId);
    brandRows.push({ id: brandId, name: b.name, slug: b.slug });

    for (const m of b.models) {
      if (modelIdBySlug.has(m.slug)) errors.push(`model slug dobel: ${m.slug}`);
      const modelId = randomUUID();
      modelIdBySlug.set(m.slug, modelId);
      modelRows.push({
        id: modelId,
        brandId,
        name: m.name,
        slug: m.slug,
        engineCc: m.engineCc,
        type: m.type,
      });

      const seenYears = new Set<number>();
      const variantIds: string[] = [];
      for (const v of m.variants) {
        if (seenYears.has(v.yearFrom)) {
          errors.push(`yearFrom dobel di ${m.slug}: ${v.yearFrom}`);
        }
        seenYears.add(v.yearFrom);

        const variantId = randomUUID();
        variantIdByKey.set(`${m.slug}-${v.yearFrom}`, variantId);
        variantIds.push(variantId);
        variantRows.push({
          id: variantId,
          modelId,
          name: v.name,
          yearFrom: v.yearFrom,
          yearTo: v.yearTo,
        });
      }
      variantIdsByModelSlug.set(m.slug, variantIds);
    }
  }

  // ---------- Kategori (induk dulu, lalu leaf) ----------
  const leafSlugs = new Set<string>();
  categories.forEach((c, i) => {
    if (categoryIdBySlug.has(c.slug)) errors.push(`kategori slug dobel: ${c.slug}`);

    const id = randomUUID();
    categoryIdBySlug.set(c.slug, id);

    if (c.parent) {
      leafSlugs.add(c.slug);
      const parentId = categoryIdBySlug.get(c.parent);
      if (!parentId) errors.push(`induk tidak ada: ${c.parent} (anak: ${c.slug})`);
      leafRows.push({
        id,
        parentId: parentId ?? null,
        name: c.name,
        slug: c.slug,
        sortOrder: i,
      });
    } else {
      parentRows.push({ id, parentId: null, name: c.name, slug: c.slug, sortOrder: i });
    }
  });

  // ---------- Produk + fitment ----------
  const productSlugs = new Set<string>();
  for (const p of products) {
    if (productIdBySku.has(p.sku)) errors.push(`sku dobel: ${p.sku}`);
    if (productSlugs.has(p.slug)) errors.push(`slug produk dobel: ${p.slug}`);
    if (!leafSlugs.has(p.category)) {
      errors.push(`${p.sku}: kategori bukan leaf/tidak ada: ${p.category}`);
    }
    if (p.fits.length === 0) errors.push(`${p.sku}: fits kosong`);

    const productId = randomUUID();
    productIdBySku.set(p.sku, productId);
    productSlugs.add(p.slug);
    productRows.push({
      id: productId,
      categoryId: categoryIdBySlug.get(p.category)!,
      sku: p.sku,
      partNumber: p.partNumber ?? null,
      brand: p.brand,
      name: p.name,
      slug: p.slug,
      price: p.price,
      stock: p.stock,
      weightGram: p.weightGram,
      condition: p.condition,
    });

    // Token `fits`: slug model (semua variannya) atau key varian.
    // Set mencegah PK (product_id, variant_id) dobel bila keduanya dipakai untuk model yang sama.
    const fittedVariantIds = new Set<string>();
    for (const f of p.fits) {
      const byModel = variantIdsByModelSlug.get(f);
      if (byModel) {
        for (const variantId of byModel) fittedVariantIds.add(variantId);
      } else if (variantIdByKey.has(f)) {
        fittedVariantIds.add(variantIdByKey.get(f)!);
      } else {
        errors.push(`${p.sku}: fits tidak dikenal: ${f}`);
      }
    }
    for (const variantId of fittedVariantIds) {
      fitmentRows.push({ productId, variantId });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validasi data seed gagal (${errors.length}):\n- ${errors.join("\n- ")}`);
  }

  // ---------- Tulis ke DB ----------
  await db.transaction(async (tx) => {
    // Hapus anak dulu: product->category dan model->brand memakai onDelete restrict.
    // Sengaja pakai DELETE, bukan TRUNCATE ... CASCADE (akan ikut mengosongkan tabel commerce).
    await tx.delete(productFitment);
    await tx.delete(product);
    await tx.delete(category).where(isNotNull(category.parentId));
    await tx.delete(category);
    await tx.delete(motorcycleVariant);
    await tx.delete(motorcycleModel);
    await tx.delete(motorcycleBrand);

    await tx.insert(motorcycleBrand).values(brandRows);
    await tx.insert(motorcycleModel).values(modelRows);
    await tx.insert(motorcycleVariant).values(variantRows);
    await tx.insert(category).values(parentRows);
    await tx.insert(category).values(leafRows);
    await tx.insert(product).values(productRows);
    // Satu statement batch (~795 baris x 2 kolom, jauh di bawah batas 65535 parameter pg).
    if (fitmentRows.length > 0) await tx.insert(productFitment).values(fitmentRows);
  });

  console.log("Seed selesai:");
  console.log({
    brands: brandRows.length,
    models: modelRows.length,
    variants: variantRows.length,
    categories: parentRows.length + leafRows.length,
    categoriesParent: parentRows.length,
    categoriesLeaf: leafRows.length,
    products: productRows.length,
    fitments: fitmentRows.length,
  });
}

main()
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Tanpa ini proses menggantung karena pool masih terbuka.
    await db.$client.end();
  });
