import { test, expect } from "bun:test";
import { isRelayAuthorized, isSingleEmailAddress, parseRelayEmail } from "./mail-relay";

const good = { to: "a@b.co", subject: "Hi", html: "<p>x</p>", text: "x", fromName: "Medialane" };

test("the right secret is authorized and anything else is not", () => {
  expect(isRelayAuthorized("s3cret", "s3cret")).toBe(true);
  expect(isRelayAuthorized("s3cret", "other")).toBe(false);
  expect(isRelayAuthorized("s3cret", "")).toBe(false);
});

test("only a single plain address is accepted as the recipient", () => {
  expect(isSingleEmailAddress("alice@example.com")).toBe(true);
  expect(isSingleEmailAddress("a@b.co, c@d.co")).toBe(false);
  expect(isSingleEmailAddress("Alice <a@b.co>")).toBe(false);
  expect(isSingleEmailAddress("a@b.co\r\nBcc: c@d.co")).toBe(false);
});

test("a complete message is accepted", () => {
  expect(parseRelayEmail(good)).toEqual(good);
});

test("the sender name defaults when it is left out", () => {
  const { fromName: _omitted, ...rest } = good;
  expect(parseRelayEmail(rest)?.fromName).toBe("Medialane.io");
});

test("a message missing a part, or not an object, is refused", () => {
  for (const key of ["to", "subject", "html", "text"] as const) {
    expect(parseRelayEmail({ ...good, [key]: "" })).toBeNull();
  }
  expect(parseRelayEmail(null)).toBeNull();
  expect(parseRelayEmail("x")).toBeNull();
});

test("a subject or sender name that could inject headers is refused", () => {
  expect(parseRelayEmail({ ...good, subject: "Hi\r\nBcc: x@y.z" })).toBeNull();
  expect(parseRelayEmail({ ...good, fromName: "Bank <x@y.z>" })).toBeNull();
  expect(parseRelayEmail({ ...good, fromName: "x".repeat(41) })).toBeNull();
});
