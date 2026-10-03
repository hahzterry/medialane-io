export type HealthState = "done" | "todo" | "loading";

export interface HealthItem {
  id: string;
  label: string;
  state: HealthState;
  href: string;
}

export interface SecurityInput {
  email: { email: string | null; verified: boolean } | null;
  walletDeployed: boolean | null;
  devices: number | null;
  guardians: number | null;
}

const item = (id: string, label: string, state: HealthState, href: string): HealthItem => ({ id, label, state, href });

export function securityChecklist(input: SecurityInput): HealthItem[] {
  const { email, walletDeployed, devices, guardians } = input;

  const emailItem = !email
    ? item("email", "Email", "loading", "/settings/email")
    : !email.email
      ? item("email", "Add your email", "todo", "/settings/email")
      : email.verified
        ? item("email", "Email confirmed", "done", "/settings/email")
        : item("email", "Confirm your email", "todo", "/settings/email");

  const walletItem =
    walletDeployed === null
      ? item("wallet", "Wallet", "loading", "/settings/wallet")
      : walletDeployed
        ? item("wallet", "Wallet ready", "done", "/settings/wallet")
        : item("wallet", "Wallet is setting up", "todo", "/settings/wallet");

  const recoveryItem =
    guardians === null
      ? item("recovery", "Recovery", "loading", "/settings/recovery")
      : guardians > 0
        ? item("recovery", "Recovery set up", "done", "/settings/recovery")
        : item("recovery", "Set up recovery", "todo", "/settings/recovery");

  const devicesItem =
    devices === null
      ? item("devices", "Devices", "loading", "/settings/devices")
      : devices >= 2
        ? item("devices", `${devices} devices`, "done", "/settings/devices")
        : item("devices", devices === 1 ? "Add a second device" : "Add a device", "todo", "/settings/devices");

  return [emailItem, walletItem, recoveryItem, devicesItem];
}

export interface ProfileInput {
  name: string;
  bio: string;
  avatarImage: string;
  username: string | null;
  hasLinks: boolean;
}

export function profileChecklist(p: ProfileInput): HealthItem[] {
  const state = (ok: boolean): HealthState => (ok ? "done" : "todo");
  return [
    item("name", "Name", state(p.name.trim().length > 0), "/settings/profile"),
    item("bio", "Bio", state(p.bio.trim().length > 0), "/settings/profile"),
    item("avatar", "Avatar", state(p.avatarImage.length > 0), "/settings/appearance"),
    item("username", "Username", state(p.username !== null), "/settings/profile"),
    item("links", "Links", state(p.hasLinks), "/settings/profile"),
  ];
}

export function healthSummary(items: HealthItem[]): { done: number; total: number } {
  const known = items.filter((i) => i.state !== "loading");
  return { done: known.filter((i) => i.state === "done").length, total: known.length };
}
