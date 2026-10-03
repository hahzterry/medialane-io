"use client";

import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { cn } from "@/lib/utils";
import type { RowStatus, RowTone } from "@/lib/settings/rows";

export function SettingsPage({
  title,
  subtitle,
  back = true,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6 px-4 pb-10 pt-20 sm:pt-24">
      <div className="space-y-2">
        {back ? (
          <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Settings
          </Link>
        ) : null}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SettingsGate({ children }: { children: ReactNode }) {
  const { hasWallet } = useWalletNativeSession();
  if (hasWallet) return <>{children}</>;
  return (
    <div className="space-y-4 px-4 py-24 text-center">
      <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Secure your account</h1>
      <p className="mx-auto max-w-sm text-muted-foreground">Secure your account to manage your creator settings.</p>
      <div className="btn-border-animated inline-block rounded-lg p-[1px]">
        <Button
          asChild
          className="rounded-[7px] bg-transparent text-white transition-all hover:bg-transparent hover:brightness-110 active:scale-[0.98]"
        >
          <Link href="/connect?redirect_url=/settings">Get started</Link>
        </Button>
      </div>
    </div>
  );
}

export function SettingsGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</h2>
      <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">{children}</div>
    </section>
  );
}

const TONE: Record<RowTone, string> = {
  ok: "text-emerald-600 dark:text-emerald-400",
  warn: "text-yellow-700 dark:text-yellow-400",
  muted: "text-muted-foreground",
};

export function SettingsRow({
  href,
  icon: Icon,
  label,
  status,
}: {
  href: string;
  icon: ElementType;
  label: string;
  status?: RowStatus | null;
}) {
  return (
    <Link href={href} className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 active:bg-muted/60">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {status === undefined ? null : status === null ? (
        <Skeleton className="h-4 w-16" />
      ) : (
        <span className={cn("text-sm", TONE[status.tone])}>{status.value}</span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
