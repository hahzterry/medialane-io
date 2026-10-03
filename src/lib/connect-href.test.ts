import { describe, expect, test } from "bun:test";
import { connectHref } from "./connect-href";
import { safeRelativePath } from "./safe-redirect";

describe("the link that takes a signed-out person to sign in", () => {
  test("brings them back to the page they were on", () => {
    expect(connectHref("/claim/username")).toBe("/connect?redirect_url=%2Fclaim%2Fusername");
  });

  test("the page it returns to is accepted by the sign-in page's own safety check", () => {
    const url = new URL(connectHref("/claim/memecoin"), "https://www.medialane.io");
    expect(safeRelativePath(url.searchParams.get("redirect_url"))).toBe("/claim/memecoin");
  });
});
