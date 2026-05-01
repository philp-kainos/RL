import { describe, expect, it, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mock builders
// ---------------------------------------------------------------------------
const {
  mockDb,
  mockCookieStore,
  mockGetOrCreateGuestCart,
  mockGetOrCreateUserCart,
  mockVerifySessionToken,
  mockGenerateSessionId,
  mockSignSessionId,
  mockGetUser,
} = vi.hoisted(() => {
  const mockSelFrom = vi.fn();
  const mockSelWhere = vi.fn();
  const mockUpdSet = vi.fn();
  const mockUpdWhere = vi.fn();
  const mockInsValues = vi.fn();
  const mockDelWhere = vi.fn();

  const mockDb = {
    select: vi.fn(),
    _selFrom: mockSelFrom,
    _selWhere: mockSelWhere,
    update: vi.fn(),
    _updSet: mockUpdSet,
    _updWhere: mockUpdWhere,
    insert: vi.fn(),
    _insValues: mockInsValues,
    delete: vi.fn(),
    _delWhere: mockDelWhere,
  };

  const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
  };

  return {
    mockDb,
    mockCookieStore,
    mockGetOrCreateGuestCart: vi.fn(),
    mockGetOrCreateUserCart: vi.fn(),
    mockVerifySessionToken: vi.fn(),
    mockGenerateSessionId: vi.fn(),
    mockSignSessionId: vi.fn(),
    mockGetUser: vi.fn(),
  };
});

vi.mock("@/lib/db", () => ({ db: mockDb }));
vi.mock("@/lib/schema/carts", () => ({ cartItems: {} }));
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((_col, val) => `eq(${String(val)})`),
  and: vi.fn((...args: unknown[]) => `and(${args.join(",")})`),
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));
vi.mock("@/lib/cart", () => ({
  getOrCreateGuestCart: mockGetOrCreateGuestCart,
  getOrCreateUserCart: mockGetOrCreateUserCart,
}));
vi.mock("@/lib/cart-cookie", () => ({
  verifySessionToken: mockVerifySessionToken,
  generateSessionId: mockGenerateSessionId,
  signSessionId: mockSignSessionId,
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { addToCart, removeFromCart } from "./actions";

// ---------------------------------------------------------------------------
// Helpers to reset chain wiring between tests
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks();

  // Default: guest user (not authenticated)
  mockGetUser.mockResolvedValue({ data: { user: null } });

  // Default: no existing cart cookie
  mockCookieStore.get.mockReturnValue(undefined);

  // Default cart helpers
  mockGenerateSessionId.mockReturnValue("new-session-id");
  mockSignSessionId.mockReturnValue("signed-new-session-id");
  mockGetOrCreateGuestCart.mockResolvedValue("guest-cart-id");
  mockGetOrCreateUserCart.mockResolvedValue("user-cart-id");

  // Rewire select chain
  mockDb.select.mockReturnValue({ from: mockDb._selFrom });
  mockDb._selFrom.mockReturnValue({ where: mockDb._selWhere });

  // Rewire update chain
  mockDb.update.mockReturnValue({ set: mockDb._updSet });
  mockDb._updSet.mockReturnValue({ where: mockDb._updWhere });
  mockDb._updWhere.mockResolvedValue(undefined);

  // Rewire insert chain (no .returning)
  mockDb.insert.mockReturnValue({ values: mockDb._insValues });
  mockDb._insValues.mockResolvedValue(undefined);

  // Rewire delete chain
  mockDb.delete.mockReturnValue({ where: mockDb._delWhere });
  mockDb._delWhere.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// addToCart — add new item
// ---------------------------------------------------------------------------
describe("addToCart", () => {
  it("inserts a new item for a guest with no existing session cookie", async () => {
    // No existing item in cart
    mockDb._selWhere.mockResolvedValueOnce([]);

    await addToCart({ productId: 1, quantity: 2 });

    expect(mockGenerateSessionId).toHaveBeenCalledOnce();
    expect(mockSignSessionId).toHaveBeenCalledWith("new-session-id");
    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    expect(mockGetOrCreateGuestCart).toHaveBeenCalledWith("new-session-id");
    expect(mockDb.insert).toHaveBeenCalledOnce();
    expect(mockDb._insValues).toHaveBeenCalledWith({
      cartId: "guest-cart-id",
      productId: 1,
      quantity: 2,
    });
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it("inserts a new item for a guest with a valid session cookie", async () => {
    mockCookieStore.get.mockReturnValue({ value: "signed-token" });
    mockVerifySessionToken.mockReturnValue("existing-session-id");
    mockDb._selWhere.mockResolvedValueOnce([]);

    await addToCart({ productId: 3, quantity: 1 });

    expect(mockVerifySessionToken).toHaveBeenCalledWith("signed-token");
    expect(mockGenerateSessionId).not.toHaveBeenCalled();
    expect(mockCookieStore.set).not.toHaveBeenCalled();
    expect(mockGetOrCreateGuestCart).toHaveBeenCalledWith("existing-session-id");
    expect(mockDb.insert).toHaveBeenCalledOnce();
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it("uses the user cart for authenticated users and skips cookie management", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-uuid" } } });
    mockDb._selWhere.mockResolvedValueOnce([]);

    await addToCart({ productId: 2, quantity: 3 });

    expect(mockGetOrCreateUserCart).toHaveBeenCalledWith("user-uuid");
    expect(mockGetOrCreateGuestCart).not.toHaveBeenCalled();
    expect(mockCookieStore.set).not.toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalledOnce();
  });

  // --- increment ---
  it("increments quantity when item already exists in cart", async () => {
    mockCookieStore.get.mockReturnValue({ value: "signed-token" });
    mockVerifySessionToken.mockReturnValue("existing-session-id");
    // Existing item with qty 2
    mockDb._selWhere.mockResolvedValueOnce([{ id: "item-uuid", quantity: 2 }]);

    await addToCart({ productId: 5, quantity: 3 });

    expect(mockDb.update).toHaveBeenCalledOnce();
    expect(mockDb._updSet).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 5 }),
    );
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  // --- validation ---
  it("throws ZodError for non-positive productId", async () => {
    await expect(addToCart({ productId: 0, quantity: 1 })).rejects.toThrow();
  });

  it("throws ZodError for zero quantity", async () => {
    await expect(addToCart({ productId: 1, quantity: 0 })).rejects.toThrow();
  });

  it("throws ZodError for quantity exceeding max", async () => {
    await expect(addToCart({ productId: 1, quantity: 100 })).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// removeFromCart
// ---------------------------------------------------------------------------
describe("removeFromCart", () => {
  it("deletes the cart item for a guest with a valid session cookie", async () => {
    mockCookieStore.get.mockReturnValue({ value: "signed-token" });
    mockVerifySessionToken.mockReturnValue("existing-session-id");

    await removeFromCart({ productId: 7 });

    expect(mockGetOrCreateGuestCart).toHaveBeenCalledWith("existing-session-id");
    expect(mockDb.delete).toHaveBeenCalledOnce();
    expect(mockDb._delWhere).toHaveBeenCalledOnce();
  });

  it("does nothing when there is no cart cookie", async () => {
    await removeFromCart({ productId: 7 });

    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("does nothing when the cookie signature is invalid", async () => {
    mockCookieStore.get.mockReturnValue({ value: "tampered-token" });
    mockVerifySessionToken.mockReturnValue(null);

    await removeFromCart({ productId: 7 });

    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("deletes from user cart for authenticated users", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-uuid" } } });

    await removeFromCart({ productId: 4 });

    expect(mockGetOrCreateUserCart).toHaveBeenCalledWith("user-uuid");
    expect(mockDb.delete).toHaveBeenCalledOnce();
  });

  it("throws ZodError for invalid productId", async () => {
    await expect(removeFromCart({ productId: -1 })).rejects.toThrow();
  });
});
