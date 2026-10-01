"use client";

import { uploadFileToIpfs } from "@medialane/ui";
import { getMedialaneClient } from "@/lib/medialane-client";

export async function uploadDocumentToIpfs(file: File): Promise<string> {
  return (await uploadFileToIpfs(getMedialaneClient().api, file, "document")).uri;
}
