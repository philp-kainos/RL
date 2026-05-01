import { and, eq, isNull } from "drizzle-orm";

import { db } from "./db";
import { cartItems, carts } from "./schema/carts";

/**
 * Returns the cart ID for the given guest session, creating one if needed.
 */
export async function getOrCreateGuestCart(sessionId: string): Promise<string> {
  const [existing] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.sessionId, sessionId));

  if (existing) return existing.id;

  const [created] = await db
    .insert(carts)
    .values({ sessionId })
    .returning({ id: carts.id });

  return created.id;
}

/**
 * Returns the cart ID for the authenticated user, creating one if needed.
 */
export async function getOrCreateUserCart(userId: string): Promise<string> {
  const [existing] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.userId, userId));

  if (existing) return existing.id;

  const [created] = await db
    .insert(carts)
    .values({ userId })
    .returning({ id: carts.id });

  return created.id;
}

/**
 * Merges items from the guest session cart into the user's cart on login.
 * Quantities are summed for products that exist in both carts.
 * The guest cart is deleted after the merge.
 */
export async function mergeGuestCartToUser(
  sessionId: string,
  userId: string,
): Promise<void> {
  const [guestCart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(and(eq(carts.sessionId, sessionId), isNull(carts.userId)));

  if (!guestCart) return;

  const userCartId = await getOrCreateUserCart(userId);

  const guestItemsList = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, guestCart.id));

  for (const item of guestItemsList) {
    const [existing] = await db
      .select({ id: cartItems.id, quantity: cartItems.quantity })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, userCartId),
          eq(cartItems.productId, item.productId),
        ),
      );

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db
        .insert(cartItems)
        .values({ cartId: userCartId, productId: item.productId, quantity: item.quantity });
    }
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
  await db.delete(carts).where(eq(carts.id, guestCart.id));
}
