import type { Metadata } from "next";
import { Suspense } from "react";
import { canonical } from "@/lib/seo";
import ConfirmEmailContent from "./confirm-email-content";

export const metadata: Metadata = {
  title: "Confirm Your Email",
  description: "Confirm your email to keep your Medialane account.",
  alternates: canonical("/confirm-email"),
  robots: { index: false, follow: false },
};

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
