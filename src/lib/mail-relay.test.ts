import { test, expect, describe } from "bun:test";
import { isRelayAuthorized, isSingleEmailAddress, parseRelayRequest } from "./mail-relay";

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

test("a request that carries html instead of a template is refused", () => {
  expect(parseRelayRequest({ to: "a@b.co", subject: "Hi", html: "<p>x</p>", text: "x", fromName: "Medialane" }, "https://www.medialane.io")).toBeNull();
  expect(parseRelayRequest(null, "https://www.medialane.io")).toBeNull();
  expect(parseRelayRequest("x", "https://www.medialane.io")).toBeNull();
});

describe("a template request", () => {
  const APP = "https://www.medialane.io";
  const request = { to: "a@b.co", fromName: "Acme", template: "verification-code", data: { code: "482913" } };

  test("is rendered by the relay into the message to send", () => {
    const email = parseRelayRequest(request, APP);
    expect(email?.to).toBe("a@b.co");
    expect(email?.fromName).toBe("Acme");
    expect(email?.subject).toBe("Your verification code");
    expect(email?.html).toContain("482913");
  });

  test("the sender name defaults when left out", () => {
    const { fromName: _omitted, ...rest } = request;
    expect(parseRelayRequest(rest, APP)?.fromName).toBe("Medialane.io");
  });

  test("a bad recipient, sender name, template or data is refused", () => {
    expect(parseRelayRequest({ ...request, to: "a@b.co, c@d.co" }, APP)).toBeNull();
    expect(parseRelayRequest({ ...request, fromName: "Bank <x@y.z>" }, APP)).toBeNull();
    expect(parseRelayRequest({ ...request, template: "nope" }, APP)).toBeNull();
    expect(parseRelayRequest({ ...request, data: { code: "<b>1</b>" } }, APP)).toBeNull();
  });

  test("caller supplied html is ignored: only the template's own markup is sent", () => {
    const email = parseRelayRequest({ ...request, html: "<a href='https://evil.example'>x</a>", subject: "Pay now" }, APP);
    expect(email?.html).not.toContain("evil.example");
    expect(email?.subject).toBe("Your verification code");
  });
});
