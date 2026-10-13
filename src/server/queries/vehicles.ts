import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  motorcycleBrand,
  motorcycleModel,
  motorcycleVariant,
} from "@/db/schema";

export async function getBrands() {
  return db
    .select()
    .from(motorcycleBrand)
    .orderBy(motorcycleBrand.name);
}

export async function getModelsByBrand(brandSlug: string) {
  return db
    .select()
    .from(motorcycleModel)
    .innerJoin(
      motorcycleBrand,
      eq(motorcycleModel.brandId, motorcycleBrand.id)
    )
    .where(eq(motorcycleBrand.slug, brandSlug))
    .orderBy(motorcycleModel.name);
}

export async function getVariantsByModel(modelSlug: string) {
  return db
    .select()
    .from(motorcycleVariant)
    .innerJoin(
      motorcycleModel,
      eq(motorcycleVariant.modelId, motorcycleModel.id)
    )
    .where(eq(motorcycleModel.slug, modelSlug))
    .orderBy(motorcycleVariant.yearFrom);
}

export async function getVehicleTree() {
  const rows = await db
    .select({
      brandId: motorcycleBrand.id,
      brandName: motorcycleBrand.name,
      brandSlug: motorcycleBrand.slug,
      modelId: motorcycleModel.id,
      modelName: motorcycleModel.name,
      modelSlug: motorcycleModel.slug,
      variantId: motorcycleVariant.id,
      variantName: motorcycleVariant.name,
      yearFrom: motorcycleVariant.yearFrom,
      yearTo: motorcycleVariant.yearTo,
    })
    .from(motorcycleBrand)
    .innerJoin(
      motorcycleModel,
      eq(motorcycleModel.brandId, motorcycleBrand.id)
    )
    .innerJoin(
      motorcycleVariant,
      eq(motorcycleVariant.modelId, motorcycleModel.id)
    )
    .orderBy(
      motorcycleBrand.name,
      motorcycleModel.name,
      motorcycleVariant.yearFrom
    );

  const brandMap = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      models: Map<
        string,
        {
          id: string;
          name: string;
          slug: string;
          variants: Array<{
            id: string;
            name: string;
            yearFrom: number;
            yearTo: number | null;
          }>;
        }
      >;
    }
  >();

  for (const row of rows) {
    if (!brandMap.has(row.brandId)) {
      brandMap.set(row.brandId, {
        id: row.brandId,
        name: row.brandName,
        slug: row.brandSlug,
        models: new Map(),
      });
    }

    const brand = brandMap.get(row.brandId)!;
    if (!brand.models.has(row.modelId)) {
      brand.models.set(row.modelId, {
        id: row.modelId,
        name: row.modelName,
        slug: row.modelSlug,
        variants: [],
      });
    }

    brand.models.get(row.modelId)!.variants.push({
      id: row.variantId,
      name: row.variantName,
      yearFrom: row.yearFrom,
      yearTo: row.yearTo,
    });
  }

  return Array.from(brandMap.values()).map((brand) => ({
    ...brand,
    models: Array.from(brand.models.values()),
  }));
}
