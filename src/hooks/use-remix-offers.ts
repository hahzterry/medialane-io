import useSWR from "swr";
import type { ApiRemixOffer, ApiResponse, ConfirmRemixOfferParams, ConfirmSelfRemixParams, CreateRemixOfferParams } from "@medialane/sdk";
import { useTokenRemixes as useTokenRemixesBase } from "@medialane/ui";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { useSiwsToken } from "@/hooks/use-siws-token";
import { getMedialaneClient } from "@/lib/medialane-client";

export function useRemixOffers(role: "creator" | "requester", status?: string) {
  const { address: walletAddress } = useWalletNativeSession();
  const { getValidToken, signIn } = useSiwsToken();
  const key = walletAddress ? `remix-offers-${role}-${status ?? "all"}` : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ApiRemixOffer[]>>(
    key,
    async () => {
      const token = getValidToken() ?? (await signIn());
      if (!token) throw new Error("Wallet sign-in is required");
      return getMedialaneClient().api.getRemixOffers({ role, status }, token);
    },
    { refreshInterval: 30000, revalidateOnFocus: false }
  );

  return { offers: data?.data ?? [], total: data?.meta?.total ?? 0, isLoading, error, mutate };
}

export function useTokenRemixes(contract: string | null, tokenId: string | null) {
  return useTokenRemixesBase(getMedialaneClient, contract, tokenId);
}

export async function submitRemixOffer(body: CreateRemixOfferParams, token: string): Promise<ApiRemixOffer> {
  return (await getMedialaneClient().api.submitRemixOffer(body, token)).data;
}

export async function registerRemix(body: ConfirmSelfRemixParams, token: string): Promise<ApiRemixOffer> {
  return (await getMedialaneClient().api.confirmSelfRemix(body, token)).data;
}

export async function confirmRemixOffer(id: string, body: ConfirmRemixOfferParams, token: string): Promise<ApiRemixOffer> {
  return (await getMedialaneClient().api.confirmRemixOffer(id, body, token)).data;
}
