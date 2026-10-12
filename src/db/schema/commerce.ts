import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./catalog";

// ---------- Enum ----------
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "expired",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
]);

// ---------- Alamat pengguna ----------
export const address = pgTable(
  "address",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    label: text("label").notNull(), // Rumah, Kantor, ...
    recipientName: text("recipient_name").notNull(),
    phone: text("phone").notNull(),
    province: text("province").notNull(),
    city: text("city").notNull(),
    district: text("district").notNull(),
    postalCode: text("postal_code").notNull(),
    street: text("street").notNull(),
    // Isi nanti saat integrasi ongkir (mis. area_id Biteship)
    shippingAreaId: text("shipping_area_id"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [index("address_user_idx").on(t.userId)]
);

// ---------- Keranjang ----------
// Satu keranjang per user, atau per sessionId untuk guest checkout.
// Harga TIDAK disimpan di sini; selalu ambil harga terbaru dari tabel product.
export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  sessionId: text("session_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const cartItem = pgTable(
  "cart_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("cart_item_cart_product_uq").on(t.cartId, t.productId)]
);

// ---------- Order ----------
// "order" adalah kata cadangan SQL, jadi nama tabelnya "orders".
// Alamat dan harga disimpan sebagai SNAPSHOT supaya riwayat order tidak berubah
// walau user mengubah alamat atau admin mengubah harga produk.
export const order = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(), // mis. INV-20261003-0001
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    status: orderStatusEnum("status").default("pending_payment").notNull(),

    // Nominal (Rupiah)
    subtotal: integer("subtotal").notNull(),
    shippingCost: integer("shipping_cost").default(0).notNull(),
    discount: integer("discount").default(0).notNull(),
    total: integer("total").notNull(),

    // Snapshot alamat pengiriman
    shippingRecipient: text("shipping_recipient").notNull(),
    shippingPhone: text("shipping_phone").notNull(),
    shippingProvince: text("shipping_province").notNull(),
    shippingCity: text("shipping_city").notNull(),
    shippingDistrict: text("shipping_district").notNull(),
    shippingPostalCode: text("shipping_postal_code").notNull(),
    shippingStreet: text("shipping_street").notNull(),

    // Pengiriman
    courier: text("courier"), // jne, jnt, sicepat, ...
    courierService: text("courier_service"), // REG, YES, ...
    trackingNumber: text("tracking_number"),

    note: text("note"),
    paidAt: timestamp("paid_at"),
    shippedAt: timestamp("shipped_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
  ]
);

export const orderItem = pgTable(
  "order_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    // set null: produk boleh dihapus tanpa merusak riwayat order
    productId: uuid("product_id").references(() => product.id, {
      onDelete: "set null",
    }),
    // Snapshot data produk saat dibeli
    productName: text("product_name").notNull(),
    productSku: text("product_sku").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: integer("subtotal").notNull(),
  },
  (t) => [index("order_item_order_idx").on(t.orderId)]
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").notNull(),
    note: text("note"),
    changedBy: text("changed_by").references(() => user.id, {
      onDelete: "set null",
    }), // null = sistem / webhook
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("order_status_history_order_idx").on(t.orderId)]
);

// ---------- Pembayaran ----------
export const payment = pgTable(
  "payment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    provider: text("provider").default("midtrans").notNull(),
    method: text("method"), // qris, bca_va, gopay, ...
    externalId: text("external_id"), // transaction_id dari payment gateway
    status: paymentStatusEnum("status").default("pending").notNull(),
    amount: integer("amount").notNull(),
    paidAt: timestamp("paid_at"),
    payload: jsonb("payload"), // simpan webhook mentah untuk debugging
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("payment_order_idx").on(t.orderId),
    index("payment_external_idx").on(t.externalId),
  ]
);
