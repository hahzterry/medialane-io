export type RowTone = "ok" | "warn" | "muted";

export interface RowStatus {
  value: string;
  tone: RowTone;
}

export function emailRow(status: { email: string | null; verified: boolean } | null): RowStatus | null {
  if (!status) return null;
  if (!status.email) return { value: "Not set", tone: "warn" };
  return status.verified ? { value: "Confirmed", tone: "ok" } : { value: "Not confirmed", tone: "warn" };
}

export function walletRow(isDeployed: boolean | null): RowStatus | undefined {
  return isDeployed === false ? { value: "Setting up", tone: "warn" } : undefined;
}

export function usernameRow(approved: string | null, claimStatus: string | null): RowStatus | undefined {
  if (approved) return { value: `@${approved}`, tone: "ok" };
  if (claimStatus === "PENDING") return { value: "Under review", tone: "muted" };
  if (claimStatus === "REJECTED") return { value: "Rejected", tone: "warn" };
  return undefined;
}

export function accountTitle(name: string | null | undefined, email: string | null | undefined): string {
  return name || email || "Your account";
}

const LEGACY_TABS: Record<string, string> = {
  account: "/settings/email",
  profile: "/settings/profile",
};

export function legacySettingsPath(tab: string | null | undefined): string | null {
  return (tab && LEGACY_TABS[tab]) || null;
}
