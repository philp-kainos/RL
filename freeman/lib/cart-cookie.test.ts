import { describe, expect, it, vi } from "vitest";

vi.mock("./env", () => ({
  env: { CART_SECRET: "test-secret-for-cart-cookie-signing" },
}));

import { generateSessionId, signSessionId, verifySessionToken } from "./cart-cookie";

describe("lib/cart-cookie", () => {
  describe("signSessionId", () => {
    it("produces a token containing the session ID", () => {
      const token = signSessionId("abc-123");
      expect(token.startsWith("abc-123.")).toBe(true);
    });

    it("produces a different signature for a different secret (via different sessionId)", () => {
      const t1 = signSessionId("session-a");
      const t2 = signSessionId("session-b");
      expect(t1).not.toBe(t2);
    });

    it("is deterministic for the same input", () => {
      expect(signSessionId("deterministic")).toBe(signSessionId("deterministic"));
    });
  });

  describe("verifySessionToken", () => {
    it("returns the sessionId for a valid token", () => {
      const sessionId = "my-session-id";
      const token = signSessionId(sessionId);
      expect(verifySessionToken(token)).toBe(sessionId);
    });

    it("returns null when the token has no dot separator", () => {
      expect(verifySessionToken("nodothere")).toBeNull();
    });

    it("returns null when the signature is tampered", () => {
      const token = signSessionId("real-session");
      const tampered = token.slice(0, -3) + "xxx";
      expect(verifySessionToken(tampered)).toBeNull();
    });

    it("returns null when the session ID portion is tampered", () => {
      const token = signSessionId("original");
      const parts = token.split(".");
      const tampered = `tampered.${parts[1]}`;
      expect(verifySessionToken(tampered)).toBeNull();
    });
  });

  describe("generateSessionId", () => {
    it("returns a non-empty string", () => {
      expect(generateSessionId().length).toBeGreaterThan(0);
    });

    it("returns unique values each call", () => {
      expect(generateSessionId()).not.toBe(generateSessionId());
    });
  });
});
