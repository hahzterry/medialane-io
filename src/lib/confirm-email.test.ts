import { test, expect } from "bun:test";
import { confirmEmailOutcome, readConfirmToken } from "./confirm-email";

test("a link that confirms is reported as confirmed", async () => {
  expect(await confirmEmailOutcome(async () => ({ email: "a@b.co" }))).toBe("confirmed");
});

test("any failure, expired, closed or offline, is reported as an invalid link", async () => {
  expect(await confirmEmailOutcome(async () => { throw new Error("400"); })).toBe("invalid");
});

test("it confirms once per call and not before it is called", async () => {
  let calls = 0;
  const confirm = async () => { calls += 1; };
  expect(calls).toBe(0);
  await confirmEmailOutcome(confirm);
  expect(calls).toBe(1);
});

test("the token is read from the fragment", () => {
  expect(readConfirmToken("", "#token=abc.def")).toBe("abc.def");
});

test("links already sent with the token in the query still work", () => {
  expect(readConfirmToken("?token=abc.def", "")).toBe("abc.def");
});

test("the fragment wins over the query", () => {
  expect(readConfirmToken("?token=old", "#token=new")).toBe("new");
});

test("no token gives null", () => {
  expect(readConfirmToken("", "")).toBeNull();
  expect(readConfirmToken("?token=", "#token=")).toBeNull();
});
