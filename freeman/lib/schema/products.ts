import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  unitLabel: text("unit_label").notNull(),
  pricePence: integer("price_pence").notNull(),
  isPoa: boolean("is_poa").notNull().default(false),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
