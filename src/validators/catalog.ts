import { z } from "zod";

export const listProductsParamsSchema = z
  .object({
    categorySlug: z.string().optional(),
    q: z.string().optional(),
    variantId: z.string().uuid().optional(),
    sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(48).optional(),
  })
  .strict();

export type ListProductsParams = {
  categorySlug?: string;
  q?: string;
  variantId?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
};
