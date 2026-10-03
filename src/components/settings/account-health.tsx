"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { healthSummary, type HealthItem } from "@/lib/settings/health";

function HealthRow({ item }: { item: HealthItem }) {
  if (item.state === "loading") {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }
  const done = item.state === "done";
  const body = (
    <>
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60" />
      )}
      <span className={cn("flex-1 text-sm", done ? "text-muted-foreground" : "text-foreground")}>{item.label}</span>
      {done ? null : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
    </>
  );
  return done ? (
    <div className="flex items-center gap-2 py-1.5">{body}</div>
  ) : (
    <Link href={item.href} className="flex items-center gap-2 py-1.5 hover:text-foreground">
      {body}
    </Link>
  );
}

function HealthGroup({ label, items }: { label: string; items: HealthItem[] }) {
  const { done, total } = healthSummary(items);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        {total > 0 ? <span className="text-[11px] tabular-nums text-muted-foreground/70">{done}/{total}</span> : null}
      </div>
      <div className="mt-1 divide-y divide-border/40">
        {items.map((item) => (
          <HealthRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function AccountHealth({ security, profile }: { security: HealthItem[]; profile: HealthItem[] }) {
  const { done, total } = healthSummary([...security, ...profile]);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Account health</p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">Where your account and settings stand</p>
      </div>
      <div className="space-y-1.5 border-t border-border/60 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tabular-nums text-foreground">{pct}%</span>
          <span className="text-xs text-muted-foreground">{done} of {total} done</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted-foreground/15">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <HealthGroup label="Security" items={security} />
      <HealthGroup label="Profile" items={profile} />
    </div>
  );
}
