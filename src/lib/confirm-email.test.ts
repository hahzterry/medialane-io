import { test, expect } from "bun:test";
import { confirmEmailOutcome } from "./confirm-email";

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
