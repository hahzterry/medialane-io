import { describe, expect, test } from "bun:test";
import { resolveOnboardingRedirect, type OnboardingGateState } from "./onboarding-gate";

const SIGNED_UP: OnboardingGateState = {
  pathname: "/portfolio",
  hasWallet: true,
  isDeployed: true,
  isDeploying: false,
  emailStatus: { email: "a@b.co", emailVerified: true },
};

const gate = (overrides: Partial<OnboardingGateState>) => resolveOnboardingRedirect({ ...SIGNED_UP, ...overrides });

describe("someone with no wallet", () => {
  test("is left alone", () => {
    expect(gate({ hasWallet: false, isDeployed: false, emailStatus: null })).toBeNull();
  });
});

describe("a finished account", () => {
  test("is left alone", () => {
    expect(gate({})).toBeNull();
  });

  test("is left alone while we still don't know whether it is deployed or has an email", () => {
    expect(gate({ isDeployed: null, emailStatus: null })).toBeNull();
  });
});

describe("a wallet that never finished deploying", () => {
  test("is sent to finish, and brought back to the page it was on", () => {
    expect(gate({ isDeployed: false })).toBe("/wallet-onboarding?redirect_url=%2Fportfolio");
  });

  test("is not sent anywhere while a setup is still running, so the passkey is asked for once", () => {
    expect(gate({ isDeployed: false, isDeploying: true })).toBeNull();
  });

  test("is not sent away from the pages that run the setup themselves", () => {
    for (const pathname of ["/connect", "/wallet-onboarding", "/airdrop", "/mint/x", "/br/mint"]) {
      expect(gate({ pathname, isDeployed: false })).toBeNull();
    }
  });

  test("goes first, before the email is asked for", () => {
    expect(gate({ isDeployed: false, emailStatus: { email: null, emailVerified: false } })).toContain(
      "/wallet-onboarding",
    );
  });
});

describe("an account with no email", () => {
  const noEmail = { email: null, emailVerified: false };

  test("is sent to add one, and brought back to the page it was on", () => {
    expect(gate({ emailStatus: noEmail })).toBe("/connect?redirect_url=%2Fportfolio");
  });

  test("is not sent away from the pages where the email is handled", () => {
    for (const pathname of ["/connect", "/wallet-onboarding", "/settings"]) {
      expect(gate({ pathname, emailStatus: noEmail })).toBeNull();
    }
  });

  test("an email that is added but not yet verified is enough to move on", () => {
    expect(gate({ emailStatus: { email: "a@b.co", emailVerified: false } })).toBeNull();
  });
});
