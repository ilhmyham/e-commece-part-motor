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
