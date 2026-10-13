import { vehicles } from "./vehicles";
import { categories } from "./categories";
import { products } from "./products";

const errors: string[] = [];

const modelSlugs = new Set<string>();
const variantKeys = new Set<string>();
let variantCount = 0;
for (const b of vehicles) {
  for (const m of b.models) {
    if (modelSlugs.has(m.slug)) errors.push(`model slug dobel: ${m.slug}`);
    modelSlugs.add(m.slug);
    const ys = m.variants.map((v) => v.yearFrom);
    if (new Set(ys).size !== ys.length) errors.push(`yearFrom dobel di ${m.slug}`);
    for (const v of m.variants) {
      variantKeys.add(`${m.slug}-${v.yearFrom}`);
      variantCount++;
    }
  }
}

const catSlugs = new Set(categories.map((c) => c.slug));
const parentSlugs = new Set(categories.filter((c) => c.parent).map((c) => c.parent!));
for (const c of categories) {
  if (c.parent && !catSlugs.has(c.parent)) errors.push(`induk tidak ada: ${c.parent}`);
}
const leafSlugs = new Set(categories.filter((c) => c.parent).map((c) => c.slug));

const skus = new Set<string>();
const slugs = new Set<string>();
let fitmentRows = 0;
const productsPerCat = new Map<string, number>();
for (const p of products) {
  if (skus.has(p.sku)) errors.push(`sku dobel: ${p.sku}`);
  if (slugs.has(p.slug)) errors.push(`slug dobel: ${p.slug}`);
  skus.add(p.sku);
  slugs.add(p.slug);
  if (!leafSlugs.has(p.category)) errors.push(`${p.sku}: kategori bukan leaf/tidak ada: ${p.category}`);
  productsPerCat.set(p.category, (productsPerCat.get(p.category) ?? 0) + 1);
  if (p.fits.length === 0) errors.push(`${p.sku}: fits kosong`);
  const resolved = new Set<string>();
  for (const f of p.fits) {
    if (modelSlugs.has(f)) {
      for (const k of variantKeys) if (k.startsWith(f + "-") && /-\d{4}$/.test(k) && k.slice(0, k.lastIndexOf("-")) === f) resolved.add(k);
    } else if (variantKeys.has(f)) {
      resolved.add(f);
    } else {
      errors.push(`${p.sku}: fits tidak dikenal: ${f}`);
    }
  }
  fitmentRows += resolved.size;
}

for (const c of leafSlugs) if (!productsPerCat.has(c)) errors.push(`kategori kosong (tanpa produk): ${c}`);

console.log({
  brands: vehicles.length,
  models: modelSlugs.size,
  variants: variantCount,
  categoriesParent: parentSlugs.size,
  categoriesLeaf: leafSlugs.size,
  products: products.length,
  fitmentRows,
  withPartNumber: products.filter((p) => p.partNumber).length,
  outOfStock: products.filter((p) => p.stock === 0).length,
  nonNew: products.filter((p) => p.condition !== "new").length,
});
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "OK: semua referensi valid");
