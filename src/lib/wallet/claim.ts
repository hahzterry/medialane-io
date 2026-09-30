import { typedData as starknetTypedData } from "starknet";
import { computeOwnerGuid, ownerAliveTypedData, signWithPrivateKey } from "@medialane/sdk/starknet";
import { getMedialaneClient } from "@/lib/medialane-client";
import { createOwnerKey, type CreatedOwner, type SealedOwner } from "./passkey";
import { saveSealedOwner, notifyWalletChange } from "./store";

const PROOF_TTL_SECONDS = 600;

type ClaimParams = Parameters<ReturnType<typeof getMedialaneClient>["api"]["claimWallet"]>[0];

export interface ClaimWalletDeps {
  createOwnerKey(): Promise<CreatedOwner>;
  claim(params: ClaimParams): Promise<{ claimed: string[] }>;
  save(sealed: SealedOwner): void;
  now(): number;
}

const browserDeps: ClaimWalletDeps = {
  createOwnerKey,
  claim: (params) => getMedialaneClient().api.claimWallet(params),
  save: (sealed) => {
    saveSealedOwner(sealed);
    notifyWalletChange();
  },
  now: () => Math.floor(Date.now() / 1000),
};

export async function claimWaitingWallets(addresses: string[], deps: ClaimWalletDeps = browserDeps): Promise<string> {
  const { sealed, privateKeyHex } = await deps.createOwnerKey();
  const expiration = deps.now() + PROOF_TTL_SECONDS;
  const message = ownerAliveTypedData(computeOwnerGuid(sealed.ownerPubKey), expiration, "SN_MAIN");
  const proofs = addresses.map((walletAddress) => ({
    walletAddress,
    expiration,
    signature: signWithPrivateKey(privateKeyHex, starknetTypedData.getMessageHash(message as never, walletAddress)),
  }));

  const { claimed } = await deps.claim({ newOwnerPubkey: sealed.ownerPubKey, proofs });
  const [address] = claimed;
  if (!address) throw new Error("No wallet could be handed over. Please contact support.");

  deps.save({ ...sealed, address });
  return address;
}
