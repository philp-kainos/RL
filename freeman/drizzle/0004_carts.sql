CREATE TABLE IF NOT EXISTS carts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT        UNIQUE,                -- guest carts keyed by signed cookie value
  user_id    UUID,                              -- auth.users.id; NULL for guest carts
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id    UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users may manage their own cart rows.
-- Guest carts (session_id only, no user_id) are managed exclusively via the
-- server-side Drizzle client which connects as the postgres superuser.
CREATE POLICY "carts_owner_all" ON carts
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cart_items_owner_all" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  )
  WITH CHECK (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );
