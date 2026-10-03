import { createHmac, timingSafeEqual } from "node:crypto";

const SINGLE_EMAIL = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;
const FROM_NAME = /^[^\r\n<>@:]{1,40}$/;
const HMAC_KEY = "mail-relay-auth";

export interface RelayEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromName: string;
}

export const isSingleEmailAddress = (value: string): boolean => value.length <= 254 && SINGLE_EMAIL.test(value);

export function isRelayAuthorized(secret: string, provided: string): boolean {
  const expected = createHmac("sha256", HMAC_KEY).update(secret).digest();
  const actual = createHmac("sha256", HMAC_KEY).update(provided).digest();
  return timingSafeEqual(expected, actual);
}

const text = (value: unknown, max: number): string | null =>
  typeof value === "string" && value.length > 0 && value.length <= max ? value : null;

export function parseRelayEmail(body: unknown): RelayEmail | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const to = text(b.to, 254);
  const subject = text(b.subject, 200);
  const html = text(b.html, 200_000);
  const plain = text(b.text, 100_000);
  const fromName = b.fromName === undefined ? "Medialane.io" : text(b.fromName, 40);

  if (!to || !subject || !html || !plain || !fromName) return null;
  if (!isSingleEmailAddress(to) || /[\r\n]/.test(subject) || !FROM_NAME.test(fromName)) return null;
  return { to, subject, html, text: plain, fromName };
}
