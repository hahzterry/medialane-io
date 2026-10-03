"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { mediaWallet } from "@/lib/wallet/client";

const EXCLUDED_PREFIXES = ["/mint", "/br/mint", "/airdrop", "/connect", "/wallet-onboarding"];

export function UndeployedWalletRedirect() {
  const { hasWallet, isDeployed } = useWalletNativeSession();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (!hasWallet || isDeployed !== false) return;
    if (redirected.current) return;
    if (mediaWallet.isDeploying()) return;
    if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return;
    redirected.current = true;
    router.push(`/wallet-onboarding?redirect_url=${encodeURIComponent(pathname)}`);
  }, [hasWallet, isDeployed, pathname, router]);

  return null;
}
