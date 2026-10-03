import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import Content from "@/components/settings/pages/profile-page";

export const metadata: Metadata = {
  title: "Username, Name & Links — Settings",
  alternates: canonical("/settings/profile"),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Content />;
}
