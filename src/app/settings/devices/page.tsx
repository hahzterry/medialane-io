import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import Content from "@/components/settings/pages/devices-page";

export const metadata: Metadata = {
  title: "Devices — Settings",
  alternates: canonical("/settings/devices"),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Content />;
}
