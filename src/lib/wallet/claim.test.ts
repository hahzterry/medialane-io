import { test, expect } from "bun:test";
import { typedData as starknetTypedData } from "starknet";
import { computeOwnerGuid, ownerAliveTypedData, signWithPrivateKey, starkKeyPairFromPrivateKey } from "@medialane/sdk/starknet";
import { claimWaitingWallets, type ClaimWalletDeps } from "./claim";

const privateKeyHex = "0x1234567890abcdef";
const ownerPubKey = starkKeyPairFromPrivateKey(privateKeyHex).publicKeyHex;

function deps(claim: ClaimWalletDeps["claim"]) {
  const sent: unknown[] = [];
  const saved: unknown[] = [];
  const d: ClaimWalletDeps = {
    createOwnerKey: async () => ({
      privateKeyHex,
      sealed: { credentialId: "c", ownerPubKey, address: "", iv: "i", ciphertext: "x" },
    }),
    claim: async (params) => {
      sent.push(params);
      return claim(params);
    },
    save: (sealed) => {
      saved.push(sealed);
    },
    now: () => 1_000,
  };
  return { d, sent, saved };
}

test("signs an owner-alive proof per waiting wallet with the new key", async () => {
  const { d, sent } = deps(async () => ({ claimed: ["0xabc"] }));
  await claimWaitingWallets(["0xabc"], d);
  const body = sent[0] as { newOwnerPubkey: string; proofs: { walletAddress: string; signature: string[]; expiration: number }[] };
  expect(body.newOwnerPubkey).toBe(ownerPubKey);
  const expected = signWithPrivateKey(
    privateKeyHex,
    starknetTypedData.getMessageHash(ownerAliveTypedData(computeOwnerGuid(ownerPubKey), 1_600, "SN_MAIN") as never, "0xabc"),
  );
  expect(body.proofs).toEqual([{ walletAddress: "0xabc", signature: expected, expiration: 1_600 }]);
});

test("saves the new key for the claimed wallet's address", async () => {
  const { d, saved } = deps(async () => ({ claimed: ["0xabc"] }));
  expect(await claimWaitingWallets(["0xabc"], d)).toBe("0xabc");
  expect(saved).toEqual([{ credentialId: "c", ownerPubKey, address: "0xabc", iv: "i", ciphertext: "x" }]);
});

test("saves nothing when the claim is refused", async () => {
  const { d, saved } = deps(async () => {
    throw new Error("Verify your email first");
  });
  await expect(claimWaitingWallets(["0xabc"], d)).rejects.toThrow("Verify your email first");
  expect(saved).toEqual([]);
});

test("saves nothing when no wallet could be handed over", async () => {
  const { d, saved } = deps(async () => ({ claimed: [] }));
  await expect(claimWaitingWallets(["0xabc"], d)).rejects.toThrow("No wallet could be handed over");
  expect(saved).toEqual([]);
});
