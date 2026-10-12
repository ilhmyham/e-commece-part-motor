import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// ---------- Enum ----------
export const motorTypeEnum = pgEnum("motor_type", [
  "matic",
  "bebek",
  "sport",
  "naked",
  "trail",
  "moped",
]);

export const partConditionEnum = pgEnum("part_condition", [
  "new",
  "used",
  "refurbished",
]);

// ---------- Data kendaraan ----------
export const motorcycleBrand = pgTable("motorcycle_brand", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Honda, Yamaha, ...
  slug: text("slug").notNull().unique(),
});

export const motorcycleModel = pgTable(
  "motorcycle_model",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => motorcycleBrand.id, { onDelete: "restrict" }),
    name: text("name").notNull(), // Vario 125, NMAX, ...
    slug: text("slug").notNull(),
    engineCc: integer("engine_cc"),
    type: motorTypeEnum("type"),
  },
  (t) => [
    uniqueIndex("motorcycle_model_brand_slug_uq").on(t.brandId, t.slug),
    index("motorcycle_model_brand_idx").on(t.brandId),
  ]
);

// Varian = model + rentang tahun produksi (yearTo null = masih diproduksi)
export const motorcycleVariant = pgTable(
  "motorcycle_variant",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    modelId: uuid("model_id")
      .notNull()
      .references(() => motorcycleModel.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // "eSP", "CBS ISS", ...
    yearFrom: integer("year_from").notNull(),
    yearTo: integer("year_to"),
  },
  (t) => [index("motorcycle_variant_model_idx").on(t.modelId)]
);

// ---------- Kategori (hierarki) ----------
export const category = pgTable(
  "category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id").references((): AnyPgColumn => category.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (t) => [index("category_parent_idx").on(t.parentId)]
);

// ---------- Produk ----------
// Harga disimpan sebagai integer Rupiah (tanpa desimal) agar bebas error floating point.
export const product = pgTable(
  "product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "restrict" }),
    sku: text("sku").notNull().unique(),
    partNumber: text("part_number"), // nomor part OEM / pabrikan
    brand: text("brand").notNull(), // merek part: AHM, Yamaha Genuine, Aspira, ...
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    price: integer("price").notNull(),
    stock: integer("stock").default(0).notNull(),
    weightGram: integer("weight_gram").notNull(),
    condition: partConditionEnum("condition").default("new").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("product_category_idx").on(t.categoryId),
    index("product_part_number_idx").on(t.partNumber),
    index("product_active_idx").on(t.isActive),
  ]
);

export const productImage = pgTable(
  "product_image",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (t) => [index("product_image_product_idx").on(t.productId)]
);

// ---------- Fitment (inti proyek): produk <-> varian motor ----------
export const productFitment = pgTable(
  "product_fitment",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => motorcycleVariant.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.variantId] }),
    // Untuk query "semua produk yang cocok untuk varian X"
    index("product_fitment_variant_idx").on(t.variantId),
  ]
);

// Catatan pencarian: tambahkan index trigram lewat migration SQL kustom, misalnya:
//   CREATE EXTENSION IF NOT EXISTS pg_trgm;
//   CREATE INDEX product_name_trgm_idx ON product USING gin (name gin_trgm_ops);
