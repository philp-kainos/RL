"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";

import {
  generateSessionId,
  signSessionId,
  verifySessionToken,
} from "@/lib/cart-cookie";
import { getOrCreateGuestCart, getOrCreateUserCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/schema/carts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CART_COOKIE = "cart_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

const removeFromCartSchema = z.object({
  productId: z.number().int().positive(),
});

async function resolveCartIdForAdd(): Promise<string> {
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return getOrCreateUserCart(user.id);
  }

  const token = cookieStore.get(CART_COOKIE)?.value ?? null;
  let sessionId = token ? verifySessionToken(token) : null;

  if (!sessionId) {
    sessionId = generateSessionId();
    cookieStore.set(CART_COOKIE, signSessionId(sessionId), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return getOrCreateGuestCart(sessionId);
}

async function resolveExistingCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return getOrCreateUserCart(user.id);
  }

  const token = cookieStore.get(CART_COOKIE)?.value ?? null;
  const sessionId = token ? verifySessionToken(token) : null;
  if (!sessionId) return null;

  return getOrCreateGuestCart(sessionId);
}

export async function addToCart(input: unknown): Promise<void> {
  const { productId, quantity } = addToCartSchema.parse(input);
  const cartId = await resolveCartIdForAdd();

  const [existing] = await db
    .select({ id: cartItems.id, quantity: cartItems.quantity })
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, productId, quantity });
  }
}

export async function removeFromCart(input: unknown): Promise<void> {
  const { productId } = removeFromCartSchema.parse(input);
  const cartId = await resolveExistingCartId();
  if (!cartId) return;

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)));
}
