-- product-images is public because product photos are part of the marketing catalogue;
-- all visitors must read them without authentication.
INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

-- Public read for product images.
DO $$ BEGIN
  CREATE POLICY "product_images_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Only the service_role (seed script and admin uploads) may write.
DO $$ BEGIN
  CREATE POLICY "product_images_service_role_insert"
    ON storage.objects FOR INSERT
    TO service_role
    WITH CHECK (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "product_images_service_role_update"
    ON storage.objects FOR UPDATE
    TO service_role
    USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
