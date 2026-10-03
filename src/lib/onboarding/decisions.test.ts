import { describe, expect, test } from "bun:test";
import { afterCodeVerified, afterEmailCheck, afterRegister } from "./decisions";

const WALLET = "0x01575d29b83d7828cd1d833ef785083b809adeb187b6ac14aab21db568f2bf02";

describe("after the email is checked", () => {
  test("an address that already has an account is sent a login code", () => {
    expect(afterEmailCheck(true)).toBe("send-code");
  });

  test("a new address is registered", () => {
    expect(afterEmailCheck(false)).toBe("register");
  });
});

describe("after registering", () => {
  test("a freshly created account goes straight to creating its wallet", () => {
    expect(afterRegister("created")).toBe("wallet-setup");
  });

  test("an address that turns out to exist already signs in with a code instead", () => {
    expect(afterRegister("already-exists")).toBe("send-code");
  });
});

describe("after the login code is verified", () => {
  test("a new account has no wallet yet: create it (a new io user)", () => {
    expect(afterCodeVerified(null)).toEqual({ type: "wallet-setup" });
  });

  test("an account that exists but never got a wallet: create it (the retry after a failed first try)", () => {
    expect(afterCodeVerified(null)).toEqual({ type: "wallet-setup" });
  });

  test("a returning user whose wallet already has their key is finished (a returning io user)", () => {
    expect(afterCodeVerified({ walletAddress: WALLET, needsKeySetup: false })).toEqual({ type: "finish" });
  });

  test("a wallet that still has the platform's provisioning key needs the user's own key first (a provisioned user)", () => {
    expect(afterCodeVerified({ walletAddress: WALLET, needsKeySetup: true })).toEqual({
      type: "key-setup",
      walletAddress: WALLET,
    });
  });
});
