"use client";

import { pinAssetMetadata as pinAsset, type PinAssetMetadataInput, type PinnedAsset } from "@medialane/ui";
import { getMedialaneClient } from "@/lib/medialane-client";

export type { PinAssetMetadataInput, PinnedAsset };

export function pinAssetMetadata(input: PinAssetMetadataInput): Promise<PinnedAsset> {
  return pinAsset(getMedialaneClient().api, input);
}
