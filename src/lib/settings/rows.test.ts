import { describe, expect, test } from "bun:test";
import { emailRow, legacySettingsPath, usernameRow, walletRow } from "./rows";

describe("the email row", () => {
  test("shows nothing while the status is still loading", () => {
    expect(emailRow(null)).toBeNull();
  });

  test("warns when there is no email or it is not confirmed yet", () => {
    expect(emailRow({ email: null, verified: false })).toEqual({ value: "Not set", tone: "warn" });
    expect(emailRow({ email: "a@b.co", verified: false })).toEqual({ value: "Not confirmed", tone: "warn" });
  });

  test("is calm once the email is confirmed", () => {
    expect(emailRow({ email: "a@b.co", verified: true })).toEqual({ value: "Confirmed", tone: "ok" });
  });
});

describe("the wallet row", () => {
  test("shows nothing while it is still checking", () => {
    expect(walletRow(null)).toBeNull();
  });

  test("says when the wallet is still being set up, and when it is ready", () => {
    expect(walletRow(false)).toEqual({ value: "Setting up", tone: "warn" });
    expect(walletRow(true)).toEqual({ value: "Ready", tone: "ok" });
  });
});

describe("the username row", () => {
  test("shows the handle once it is approved", () => {
    expect(usernameRow("ada", null)).toEqual({ value: "@ada", tone: "ok" });
  });

  test("tells a pending or rejected claim apart from no claim at all", () => {
    expect(usernameRow(null, "PENDING")).toEqual({ value: "Under review", tone: "muted" });
    expect(usernameRow(null, "REJECTED")).toEqual({ value: "Rejected", tone: "warn" });
    expect(usernameRow(null, null)).toEqual({ value: "Not claimed", tone: "muted" });
  });

  test("an approved handle wins over an older claim record", () => {
    expect(usernameRow("ada", "REJECTED")).toEqual({ value: "@ada", tone: "ok" });
  });
});

describe("links to the old tabbed settings", () => {
  test("the account tab now lives on the email page and the profile tab on the profile page", () => {
    expect(legacySettingsPath("account")).toBe("/settings/email");
    expect(legacySettingsPath("profile")).toBe("/settings/profile");
  });

  test("anything else stays on the settings home", () => {
    expect(legacySettingsPath(undefined)).toBeNull();
    expect(legacySettingsPath("")).toBeNull();
    expect(legacySettingsPath("nonsense")).toBeNull();
  });
});
