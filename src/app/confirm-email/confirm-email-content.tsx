"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MailWarning, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMedialaneClient } from "@/lib/medialane-client";
import { confirmEmailOutcome } from "@/lib/confirm-email";

type Step = "ready" | "confirming" | "confirmed" | "invalid";

export default function ConfirmEmailContent() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [step, setStep] = useState<Step>(token ? "ready" : "invalid");

  const confirm = async () => {
    if (!token) return;
    setStep("confirming");
    setStep(await confirmEmailOutcome(() => getMedialaneClient().api.confirmEmail(token)));
  };

  const view = {
    ready: { icon: <ShieldCheck className="h-6 w-6 text-primary" />, title: "Confirm your email", body: "One click and your account is fully unrestricted." },
    confirming: { icon: <Loader2 className="h-6 w-6 animate-spin text-primary" />, title: "Confirming…", body: "" },
    confirmed: { icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />, title: "You're all set", body: "Your email is confirmed. Your account is fully unrestricted." },
    invalid: { icon: <MailWarning className="h-6 w-6 text-primary" />, title: "This link has expired", body: "Please sign up again to get a new one." },
  }[step];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{view.icon}</div>
          </div>
          <CardTitle>{view.title}</CardTitle>
          {view.body ? <CardDescription>{view.body}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          {step === "ready" ? (
            <Button size="lg" className="w-full" onClick={() => void confirm()}>
              Confirm my email
            </Button>
          ) : null}
          {step === "confirmed" ? (
            <Button size="lg" className="w-full" onClick={() => router.push("/")}>
              Go to Medialane
            </Button>
          ) : null}
          {step === "invalid" ? (
            <Button size="lg" className="w-full" onClick={() => router.push("/connect")}>
              Sign up again
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
