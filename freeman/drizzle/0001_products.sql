CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  slug        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL,
  unit_label  TEXT    NOT NULL,
  price_pence INTEGER NOT NULL,
  image_url   TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products are the public catalogue; all visitors must be able to read them.
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);
