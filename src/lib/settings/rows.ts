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

export function walletRow(isDeployed: boolean | null): RowStatus | null {
  if (isDeployed === null) return null;
  return isDeployed ? { value: "Ready", tone: "ok" } : { value: "Setting up", tone: "warn" };
}

export function usernameRow(approved: string | null, claimStatus: string | null): RowStatus {
  if (approved) return { value: `@${approved}`, tone: "ok" };
  if (claimStatus === "PENDING") return { value: "Under review", tone: "muted" };
  if (claimStatus === "REJECTED") return { value: "Rejected", tone: "warn" };
  return { value: "Not claimed", tone: "muted" };
}

const LEGACY_TABS: Record<string, string> = {
  account: "/settings/email",
  profile: "/settings/profile",
};

export function legacySettingsPath(tab: string | null | undefined): string | null {
  return (tab && LEGACY_TABS[tab]) || null;
}
