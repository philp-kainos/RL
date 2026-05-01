import { createHmac, randomUUID, timingSafeEqual } from "crypto";

import { env } from "./env";

const ALGO = "sha256";

/**
 * Returns a signed token: `<sessionId>.<hmac-base64url>`.
 * The HMAC prevents clients from forging arbitrary session IDs.
 */
export function signSessionId(sessionId: string): string {
  const sig = createHmac(ALGO, env.CART_SECRET).update(sessionId).digest("base64url");
  return `${sessionId}.${sig}`;
}

/**
 * Verifies the token and returns the embedded sessionId, or null if invalid.
 * Uses constant-time comparison to resist timing attacks.
 */
export function verifySessionToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const sessionId = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = createHmac(ALGO, env.CART_SECRET).update(sessionId).digest("base64url");

  const providedBuf = Buffer.from(providedSig);
  const expectedBuf = Buffer.from(expectedSig);

  if (providedBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(providedBuf, expectedBuf)) return null;

  return sessionId;
}

/** Generates a new random session ID (UUID v4). */
export function generateSessionId(): string {
  return randomUUID();
}
