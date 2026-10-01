"use client";

import useSWR from "swr";
import { getMedialaneClient } from "@/lib/medialane-client";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { useSiwsToken } from "@/hooks/use-siws-token";

export interface GatedContent {
  title: string | null;
  url: string;
  type: string | null;
}

export type GatedContentState =
  | { status: "not_signed_in" }
  | { status: "loading" }
  | { status: "not_holder" }
  | { status: "unlocked"; content: GatedContent }
  | { status: "error" };

export function useGatedContent(contract: string | undefined): GatedContentState {
  const { hasWallet } = useWalletNativeSession();
  const { getValidToken, signIn } = useSiwsToken();

  const { data, error, isLoading } = useSWR<GatedContent | "not_holder">(
    contract && hasWallet ? ["gated-content", contract] : null,
    async () => {
      const token = getValidToken() ?? (await signIn());
      if (!token) throw new Error("Wallet sign-in is required");
      return (await getMedialaneClient().api.getGatedContent(contract!, token)) ?? "not_holder";
    },
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  if (!hasWallet) return { status: "not_signed_in" };
  if (isLoading) return { status: "loading" };
  if (error) return { status: "error" };
  if (data === "not_holder" || data === undefined) return { status: "not_holder" };
  return { status: "unlocked", content: data };
}
