import type { Metadata } from "next";
import { ClaimPageClient } from "./claim-page-client";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Claims — Medialane",
  description: "Reserve your username, bring in a collection or a coin, or join the Creator's Airdrop on Medialane.",
  alternates: canonical("/claim"),
  openGraph: {
    title: "Claims — Medialane",
    description: "Reserve your username, bring in a collection or a coin, or join the Creator's Airdrop on Medialane.",
    type: "website",
    url: "/claim",
  },
};

export default function ClaimPage() {
  return <ClaimPageClient />;
}
