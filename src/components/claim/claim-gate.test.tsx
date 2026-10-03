import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

let hasWallet = false;
const realSession = await import("@/hooks/use-wallet-native-session");
mock.module("@/hooks/use-wallet-native-session", () => ({ ...realSession, useWalletNativeSession: () => ({ hasWallet }) }));
mock.module("next/navigation", () => ({ usePathname: () => "/claim/username" }));
mock.module("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const { ClaimGate } = await import("./claim-gate");

afterEach(cleanup);

describe("a claim page when someone is signed out", () => {
  test("shows a sign-in prompt instead of the form", () => {
    hasWallet = false;
    render(
      <ClaimGate>
        <p>the claim form</p>
      </ClaimGate>,
    );
    expect(screen.queryByText("the claim form")).toBeNull();
    expect(screen.getByText("Secure your account to make a claim")).toBeTruthy();
  });

  test("the button takes them to sign in and brings them back to this claim page", () => {
    hasWallet = false;
    render(
      <ClaimGate>
        <p>the claim form</p>
      </ClaimGate>,
    );
    const link = screen.getByRole("link", { name: "Get started" });
    expect(link.getAttribute("href")).toBe("/connect?redirect_url=%2Fclaim%2Fusername");
  });
});

describe("a claim page when someone is signed in", () => {
  test("shows the form and no prompt", () => {
    hasWallet = true;
    render(
      <ClaimGate>
        <p>the claim form</p>
      </ClaimGate>,
    );
    expect(screen.getByText("the claim form")).toBeTruthy();
    expect(screen.queryByText("Secure your account to make a claim")).toBeNull();
  });
});
