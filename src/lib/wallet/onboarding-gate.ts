import type { EmailVerificationStatus } from "@/hooks/use-email-verification-required";

export interface OnboardingGateState {
  pathname: string;
  hasWallet: boolean;
  isDeployed: boolean | null;
  isDeploying: boolean;
  emailStatus: EmailVerificationStatus | null;
}

const NO_DEPLOY_GATE_ON = ["/mint", "/br/mint", "/airdrop", "/connect", "/wallet-onboarding"];
const NO_EMAIL_GATE_ON = ["/connect", "/wallet-onboarding", "/settings"];

const onAny = (pathname: string, prefixes: string[]): boolean => prefixes.some((p) => pathname.startsWith(p));

const withReturnTo = (target: string, pathname: string): string =>
  `${target}?redirect_url=${encodeURIComponent(pathname)}`;

export function resolveOnboardingRedirect(state: OnboardingGateState): string | null {
  const { pathname, hasWallet, isDeployed, isDeploying, emailStatus } = state;
  if (!hasWallet) return null;

  if (isDeployed === false && !isDeploying && !onAny(pathname, NO_DEPLOY_GATE_ON)) {
    return withReturnTo("/wallet-onboarding", pathname);
  }

  if (emailStatus !== null && emailStatus.email === null && !onAny(pathname, NO_EMAIL_GATE_ON)) {
    return withReturnTo("/connect", pathname);
  }

  return null;
}
