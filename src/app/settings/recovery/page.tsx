import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import Content from "@/components/settings/pages/recovery-page";

export const metadata: Metadata = {
  title: "Recovery — Settings",
  alternates: canonical("/settings/recovery"),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Content />;
}
