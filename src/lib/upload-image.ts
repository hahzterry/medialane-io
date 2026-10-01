"use client";

import { uploadFileToIpfs } from "@medialane/ui";
import { getMedialaneClient } from "@/lib/medialane-client";

export async function uploadImageToIpfs(file: File): Promise<string> {
  return (await uploadFileToIpfs(getMedialaneClient().api, file, "image")).uri;
}
