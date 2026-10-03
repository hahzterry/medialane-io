"use client";

import { AssetPicker, type OwnedAsset } from "@medialane/ui";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FastMint } from "@/components/launchpad/fast-mint";
import { SettingsGate, SettingsPage } from "@/components/settings/settings-page";
import { useProfileForm } from "@/hooks/use-profile-form";
import { useTokensByOwner } from "@/hooks/use-tokens";
import { resolveTokenImage } from "@/lib/utils";

export default function AppearanceSettingsPage() {
  const { address, isLoading, form, setField, saving, saveStatus, saveError, save } = useProfileForm();
  const { tokens, isLoading: assetsLoading } = useTokensByOwner(address ?? null, 1, 100);
  const [fastMintOpen, setFastMintOpen] = useState(false);

  const assets: OwnedAsset[] = tokens.map((t) => ({
    contractAddress: t.contractAddress,
    tokenId: t.tokenId,
    name: t.metadata?.name ?? `Token #${t.tokenId}`,
    image: resolveTokenImage(t.metadata?.image),
  }));

  return (
    <SettingsGate>
      <SettingsPage title="Avatar & theme" subtitle="Pick one of your NFTs. It becomes your avatar and a subtle background theme across Medialane.">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <>
            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-5">
              <Label>Your NFTs</Label>
              <AssetPicker
                assets={assets}
                isLoading={assetsLoading}
                selected={assets.find((a) => a.image === form.avatarImage) ?? null}
                onSelect={(asset) => setField("avatarImage", asset.image ?? "")}
                onMintClick={() => setFastMintOpen(true)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={save} disabled={saving || !address} className="w-full sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              {saveStatus === "saved" ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              ) : null}
              {saveStatus === "error" && saveError ? <span className="text-sm text-destructive">{saveError}</span> : null}
            </div>
          </>
        )}

        <FastMint
          presentation="dialog"
          open={fastMintOpen}
          onClose={() => setFastMintOpen(false)}
          mediaKindLock="image"
          onMinted={(asset) => {
            setField("avatarImage", asset.image ?? "");
            setFastMintOpen(false);
          }}
        />
      </SettingsPage>
    </SettingsGate>
  );
}
