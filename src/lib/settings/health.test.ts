import { describe, expect, test } from "bun:test";
import { healthSummary, profileChecklist, securityChecklist } from "./health";

const done = (items: { id: string; state: string }[], id: string) => items.find((i) => i.id === id)?.state;

describe("the security checklist", () => {
  const ready = { email: { email: "a@b.co", verified: true }, walletDeployed: true, devices: 2, guardians: 1 };

  test("everything in place means every check is done", () => {
    expect(securityChecklist(ready).every((i) => i.state === "done")).toBe(true);
  });

  test("an unconfirmed email asks to be confirmed, and no email asks to be added", () => {
    const unconfirmed = securityChecklist({ ...ready, email: { email: "a@b.co", verified: false } }).find((i) => i.id === "email")!;
    expect(unconfirmed).toMatchObject({ state: "todo", label: "Confirm your email", href: "/settings/email" });
    const none = securityChecklist({ ...ready, email: { email: null, verified: false } }).find((i) => i.id === "email")!;
    expect(none).toMatchObject({ state: "todo", label: "Add your email", href: "/settings/email" });
  });

  test("no guardian asks to set up recovery", () => {
    const item = securityChecklist({ ...ready, guardians: 0 }).find((i) => i.id === "recovery")!;
    expect(item).toMatchObject({ state: "todo", label: "Set up recovery", href: "/settings/recovery" });
  });

  test("a single device asks for a second one", () => {
    const item = securityChecklist({ ...ready, devices: 1 }).find((i) => i.id === "devices")!;
    expect(item).toMatchObject({ state: "todo", label: "Add a second device", href: "/settings/devices" });
  });

  test("a wallet that is still being set up is not done", () => {
    expect(done(securityChecklist({ ...ready, walletDeployed: false }), "wallet")).toBe("todo");
  });

  test("anything still loading is shown as loading, never as a problem", () => {
    const loading = securityChecklist({ email: null, walletDeployed: null, devices: null, guardians: null });
    expect(loading.every((i) => i.state === "loading")).toBe(true);
  });
});

describe("the profile checklist", () => {
  const full = { name: "Ada", bio: "Hi", avatarImage: "a.png", username: "ada", hasLinks: true };

  test("a complete profile has every item done", () => {
    expect(profileChecklist(full).every((i) => i.state === "done")).toBe(true);
  });

  test("each missing piece points at the page where it is fixed", () => {
    const items = profileChecklist({ name: "", bio: "", avatarImage: "", username: null, hasLinks: false });
    expect(items.map((i) => [i.id, i.state, i.href])).toEqual([
      ["name", "todo", "/settings/profile"],
      ["bio", "todo", "/settings/profile"],
      ["avatar", "todo", "/settings/appearance"],
      ["username", "todo", "/settings/profile"],
      ["links", "todo", "/settings/profile"],
    ]);
  });

  test("blank spaces do not count as a name", () => {
    expect(done(profileChecklist({ ...full, name: "   " }), "name")).toBe("todo");
  });
});

describe("the summary", () => {
  test("counts what is done out of what is known, leaving out what is still loading", () => {
    const items = [
      { id: "a", label: "", href: "", state: "done" as const },
      { id: "b", label: "", href: "", state: "todo" as const },
      { id: "c", label: "", href: "", state: "loading" as const },
    ];
    expect(healthSummary(items)).toEqual({ done: 1, total: 2 });
  });
});
