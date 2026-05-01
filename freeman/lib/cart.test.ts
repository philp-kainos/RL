import { describe, expect, it, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock builders
// ---------------------------------------------------------------------------
const { mockDb } = vi.hoisted(() => {
  // Each operation returns a chainable builder whose terminal method is a vi.fn
  // so tests can control resolved values via mockResolvedValueOnce.
  const makeSelectChain = () => {
    const where = vi.fn();
    const from = vi.fn(() => ({ where }));
    const select = vi.fn(() => ({ from }));
    return { select, from, where };
  };

  const makeInsertChain = () => {
    const returning = vi.fn();
    const values = vi.fn(() => ({ returning }));
    const insert = vi.fn(() => ({ values }));
    return { insert, values, returning };
  };

  const makeUpdateChain = () => {
    const where = vi.fn();
    const set = vi.fn(() => ({ where }));
    const update = vi.fn(() => ({ set }));
    return { update, set, where };
  };

  const makeDeleteChain = () => {
    const where = vi.fn();
    const del = vi.fn(() => ({ where }));
    return { del, where };
  };

  const sel = makeSelectChain();
  const ins = makeInsertChain();
  const upd = makeUpdateChain();
  const del = makeDeleteChain();

  const mockDb = {
    select: sel.select,
    _selFrom: sel.from,
    _selWhere: sel.where,
    insert: ins.insert,
    _insValues: ins.values,
    _insReturning: ins.returning,
    update: upd.update,
    _updSet: upd.set,
    _updWhere: upd.where,
    delete: del.del,
    _delWhere: del.where,
  };

  return { mockDb };
});

vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("@/lib/schema/carts", () => ({ carts: {}, cartItems: {} }));
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((_col, val) => `eq(${val})`),
  and: vi.fn((...args) => `and(${args.join(",")})`),
  isNull: vi.fn((col) => `isNull(${String(col)})`),
}));

import { getOrCreateGuestCart, getOrCreateUserCart, mergeGuestCartToUser } from "./cart";

// ---------------------------------------------------------------------------
// Helpers to reset chain return values between tests
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks();

  // Default chain wiring (tests override terminal mocks as needed)
  mockDb.select.mockReturnValue({ from: mockDb._selFrom });
  mockDb._selFrom.mockReturnValue({ where: mockDb._selWhere });

  mockDb.insert.mockReturnValue({ values: mockDb._insValues });
  mockDb._insValues.mockReturnValue({ returning: mockDb._insReturning });

  mockDb.update.mockReturnValue({ set: mockDb._updSet });
  mockDb._updSet.mockReturnValue({ where: mockDb._updWhere });

  mockDb.delete.mockReturnValue({ where: mockDb._delWhere });
});

// ---------------------------------------------------------------------------
// getOrCreateGuestCart
// ---------------------------------------------------------------------------
describe("getOrCreateGuestCart", () => {
  it("returns the existing cart id when a cart is found", async () => {
    mockDb._selWhere.mockResolvedValueOnce([{ id: "cart-uuid-1" }]);

    const id = await getOrCreateGuestCart("session-abc");
    expect(id).toBe("cart-uuid-1");
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it("inserts a new cart and returns its id when none exists", async () => {
    mockDb._selWhere.mockResolvedValueOnce([]);
    mockDb._insReturning.mockResolvedValueOnce([{ id: "cart-uuid-new" }]);

    const id = await getOrCreateGuestCart("session-xyz");
    expect(id).toBe("cart-uuid-new");
    expect(mockDb.insert).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// getOrCreateUserCart
// ---------------------------------------------------------------------------
describe("getOrCreateUserCart", () => {
  it("returns the existing cart id for an authenticated user", async () => {
    mockDb._selWhere.mockResolvedValueOnce([{ id: "user-cart-1" }]);

    const id = await getOrCreateUserCart("user-uid-1");
    expect(id).toBe("user-cart-1");
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it("creates a new cart when the user has none", async () => {
    mockDb._selWhere.mockResolvedValueOnce([]);
    mockDb._insReturning.mockResolvedValueOnce([{ id: "user-cart-new" }]);

    const id = await getOrCreateUserCart("user-uid-new");
    expect(id).toBe("user-cart-new");
    expect(mockDb.insert).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// mergeGuestCartToUser
// ---------------------------------------------------------------------------
describe("mergeGuestCartToUser", () => {
  it("does nothing when no guest cart exists for the session", async () => {
    // First select: looking for guest cart — returns empty
    mockDb._selWhere.mockResolvedValueOnce([]);

    await mergeGuestCartToUser("no-session", "user-1");

    expect(mockDb.insert).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("transfers guest items that are not in the user cart", async () => {
    // 1. Find guest cart → found
    mockDb._selWhere.mockResolvedValueOnce([{ id: "guest-cart" }]);
    // 2. Find user cart (getOrCreateUserCart select) → found
    mockDb._selWhere.mockResolvedValueOnce([{ id: "user-cart" }]);
    // 3. Fetch guest items → one item
    mockDb._selWhere.mockResolvedValueOnce([
      { id: "item-1", cartId: "guest-cart", productId: 42, quantity: 2, createdAt: new Date(), updatedAt: new Date() },
    ]);
    // 4. Check if product 42 exists in user cart → not found
    mockDb._selWhere.mockResolvedValueOnce([]);
    // 5. Insert item into user cart
    mockDb._insReturning.mockResolvedValueOnce([{ id: "new-item" }]);
    // 6 & 7. Delete guest items, delete guest cart
    mockDb._delWhere.mockResolvedValue(undefined);

    await mergeGuestCartToUser("session-guest", "user-1");

    expect(mockDb.insert).toHaveBeenCalledOnce(); // one new item inserted
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalledTimes(2); // items then cart
  });

  it("sums quantities for guest items that already exist in the user cart", async () => {
    // 1. Find guest cart
    mockDb._selWhere.mockResolvedValueOnce([{ id: "guest-cart" }]);
    // 2. Find user cart
    mockDb._selWhere.mockResolvedValueOnce([{ id: "user-cart" }]);
    // 3. Guest items → product 10 with qty 3
    mockDb._selWhere.mockResolvedValueOnce([
      { id: "g-item-1", cartId: "guest-cart", productId: 10, quantity: 3, createdAt: new Date(), updatedAt: new Date() },
    ]);
    // 4. Product 10 already in user cart with qty 2
    mockDb._selWhere.mockResolvedValueOnce([{ id: "u-item-1", quantity: 2 }]);
    // 5. update call resolves
    mockDb._updWhere.mockResolvedValue(undefined);
    // 6 & 7. deletes
    mockDb._delWhere.mockResolvedValue(undefined);

    await mergeGuestCartToUser("session-guest", "user-1");

    expect(mockDb.update).toHaveBeenCalledOnce();
    // Confirm the set was called with summed quantity (2 + 3 = 5)
    expect(mockDb._updSet).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 5 }),
    );
    expect(mockDb.insert).not.toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalledTimes(2);
  });
});
