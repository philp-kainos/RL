import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // Secret used to HMAC-sign guest cart session IDs stored in cookies.
  // Use a random 32+ character string in production.
  CART_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
