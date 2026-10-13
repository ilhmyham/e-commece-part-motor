import {
  and,
  desc,
  eq,
  inArray,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  category,
  motorcycleBrand,
  motorcycleModel,
  motorcycleVariant,
  product,
  productFitment,
  productImage,
} from "@/db/schema";
import { ListProductsParams } from "@/validators/catalog";

export async function listProducts(params: ListProductsParams) {
  // Apply defaults
  const sort = params.sort ?? "newest";
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  const { categorySlug, q, variantId } = params;

  let categoryIds: string[] | undefined;

  if (categorySlug) {
    const cat = await db
      .select()
      .from(category)
      .where(eq(category.slug, categorySlug))
      .limit(1);

    if (!cat.length) {
      throw new Error(`Category not found: ${categorySlug}`);
    }

    if (!cat[0].parentId) {
      // Parent: include all children
      const children = await db
        .select({ id: category.id })
        .from(category)
        .where(eq(category.parentId, cat[0].id));
      categoryIds = [cat[0].id, ...children.map((c) => c.id)];
    } else {
      // Leaf
      categoryIds = [cat[0].id];
    }
  }

  // 1. Build unified conditions array
  const conditions = [eq(product.isActive, true)];

  if (categoryIds) {
    conditions.push(inArray(product.categoryId, categoryIds));
  }

  if (q) {
    const searchPattern = `%${q}%`;
    conditions.push(
      sql`(${product.name} ILIKE ${searchPattern} OR ${product.brand} ILIKE ${searchPattern} OR ${product.sku} ILIKE ${searchPattern})`
    );
  }

  // 2. Execute COUNT Query safely without reassigning query builder variables
  let total = 0;

  if (variantId) {
    // With fitment join
    const countResult = await db
      .select({ count: sql<number>`CAST(COUNT(DISTINCT ${product.id}) AS INTEGER)` })
      .from(product)
      .innerJoin(productFitment, eq(product.id, productFitment.productId))
      .where(and(...conditions, eq(productFitment.variantId, variantId)));
    total = countResult[0]?.count ?? 0;
  } else {
    // Standard count
    const countResult = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(product)
      .where(and(...conditions));
    total = countResult[0]?.count ?? 0;
  }

  // 3. Execute DATA Query
  const orderByParam = sort === "price_asc"
    ? product.price
    : sort === "price_desc"
      ? desc(product.price)
      : desc(product.createdAt);

  // Setup base query definitions
  const baseQuery = db
    .select({
      id: product.id,
      sku: product.sku,
      partNumber: product.partNumber,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      weightGram: product.weightGram,
      condition: product.condition,
      categoryName: category.name,
      imageUrl: productImage.url,
      imageAlt: productImage.alt,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryId, category.id))
    .leftJoin(productImage, eq(product.id, productImage.productId));

  let rows;

  if (variantId) {
    // Branch A: Apply Join + Execute
    rows = await baseQuery
      .innerJoin(productFitment, eq(product.id, productFitment.productId))
      .where(and(...conditions, eq(productFitment.variantId, variantId)))
      .orderBy(orderByParam)
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  } else {
    // Branch B: Standard Query + Execute
    rows = await baseQuery
      .where(and(...conditions))
      .orderBy(orderByParam)
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  // Deduplicate products (if product has multiple images or multiple fitments)
  const seen = new Set<string>();
  const items = rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });

  return { items, total, page, pageSize };
}

export async function getProductBySlug(slug: string) {
  // Query 1: product + category + images
  const prodAndImages = await db
    .select({
      id: product.id,
      sku: product.sku,
      partNumber: product.partNumber,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      weightGram: product.weightGram,
      condition: product.condition,
      description: product.description,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryName: category.name,
      imageId: productImage.id,
      imageUrl: productImage.url,
      imageAlt: productImage.alt,
      imageSortOrder: productImage.sortOrder,
    })
    .from(product)
    .innerJoin(category, eq(product.categoryId, category.id))
    .leftJoin(productImage, eq(product.id, productImage.productId))
    .where(and(eq(product.slug, slug), eq(product.isActive, true)));

  if (!prodAndImages.length) {
    return null;
  }

  const firstRow = prodAndImages[0];
  const images = prodAndImages
    .filter((row): row is typeof prodAndImages[number] & { imageId: string } =>
      row.imageId !== null
    )
    .map((row) => ({
      id: row.imageId,
      url: row.imageUrl!,
      alt: row.imageAlt,
      sortOrder: row.imageSortOrder!,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Query 2: product + fitments + variants + models + brands
  const fitmentRows = await db
    .select({
      variantId: motorcycleVariant.id,
      variantName: motorcycleVariant.name,
      yearFrom: motorcycleVariant.yearFrom,
      yearTo: motorcycleVariant.yearTo,
      modelSlug: motorcycleModel.slug,
      brandSlug: motorcycleBrand.slug,
    })
    .from(product)
    .leftJoin(productFitment, eq(product.id, productFitment.productId))
    .leftJoin(
      motorcycleVariant,
      eq(productFitment.variantId, motorcycleVariant.id)
    )
    .leftJoin(
      motorcycleModel,
      eq(motorcycleVariant.modelId, motorcycleModel.id)
    )
    .leftJoin(motorcycleBrand, eq(motorcycleModel.brandId, motorcycleBrand.id))
    .where(eq(product.id, firstRow.id));

  // Group variants by brand → model
  const variantsByBrandModel = new Map<
    string,
    Map<string, typeof fitmentRows>
  >();

  for (const row of fitmentRows) {
    if (!row.variantId) continue; // No fitment for this product
    const brandSlug = row.brandSlug!;
    const modelSlug = row.modelSlug!;

    if (!variantsByBrandModel.has(brandSlug)) {
      variantsByBrandModel.set(brandSlug, new Map());
    }
    const modelMap = variantsByBrandModel.get(brandSlug)!;
    if (!modelMap.has(modelSlug)) {
      modelMap.set(modelSlug, []);
    }
    modelMap.get(modelSlug)!.push(row);
  }

  // Sort variants within each model
  const variants: Array<{
    brandSlug: string;
    modelSlug: string;
    items: Array<{
      variantId: string;
      name: string;
      yearFrom: number;
      yearTo: number | null;
    }>;
  }> = [];

  for (const [brandSlug, modelMap] of variantsByBrandModel) {
    for (const [modelSlug, rows] of modelMap) {
      const sorted = rows.sort((a, b) => (a.yearFrom ?? 0) - (b.yearFrom ?? 0));
      variants.push({
        brandSlug,
        modelSlug,
        items: sorted.map((r) => ({
          variantId: r.variantId!,
          name: r.variantName!,
          yearFrom: r.yearFrom!,
          yearTo: r.yearTo,
        })),
      });
    }
  }

  return {
    id: firstRow.id,
    sku: firstRow.sku,
    partNumber: firstRow.partNumber,
    name: firstRow.name,
    slug: firstRow.slug,
    brand: firstRow.brand,
    price: firstRow.price,
    stock: firstRow.stock,
    weightGram: firstRow.weightGram,
    condition: firstRow.condition,
    description: firstRow.description,
    isActive: firstRow.isActive,
    createdAt: firstRow.createdAt,
    updatedAt: firstRow.updatedAt,
    categoryName: firstRow.categoryName,
    images,
    variants,
  };
}

export async function isProductFitVariant(
  productId: string,
  variantId: string
): Promise<boolean> {
  const result = await db
    .select()
    .from(productFitment)
    .where(
      and(
        eq(productFitment.productId, productId),
        eq(productFitment.variantId, variantId)
      )
    )
    .limit(1);

  return result.length > 0;
}