import { describe, expect, test } from "bun:test";
import { emptyProfileForm, invalidUrlFields, isValidUrl, profileFormFrom, profilePayload } from "./profile";

describe("link validation", () => {
  test("accepts web and ipfs links, and an empty field", () => {
    for (const ok of ["", "http://a.io", "https://a.io/x", "ipfs://Qm123"]) expect(isValidUrl(ok)).toBe(true);
  });

  test("rejects anything else", () => {
    for (const bad of ["a.io", "javascript:alert(1)", "ftp://a.io", "twitter.com/x"]) expect(isValidUrl(bad)).toBe(false);
  });

  test("names the link fields that are wrong", () => {
    expect(invalidUrlFields({ ...emptyProfileForm, websiteUrl: "a.io", twitterUrl: "https://x.com/a", telegramUrl: "t.me/a" })).toEqual([
      "websiteUrl",
      "telegramUrl",
    ]);
  });
});

describe("loading a profile into the form", () => {
  test("missing values become empty fields", () => {
    expect(profileFormFrom({ name: null, bio: undefined, avatarImage: "i.png" })).toEqual({ ...emptyProfileForm, avatarImage: "i.png" });
  });
});

describe("saving the form", () => {
  test("sends every field, and an empty field as null so it clears", () => {
    expect(profilePayload({ ...emptyProfileForm, name: "Ada" })).toEqual({
      name: "Ada",
      bio: null,
      avatarImage: null,
      websiteUrl: null,
      twitterUrl: null,
      discordUrl: null,
      telegramUrl: null,
    });
  });

  test("keeps the other fields intact when a page only edits one", () => {
    const loaded = profileFormFrom({ name: "Ada", bio: "Hi", avatarImage: "old.png", websiteUrl: "https://a.io" });
    const payload = profilePayload({ ...loaded, avatarImage: "new.png" });
    expect(payload.name).toBe("Ada");
    expect(payload.bio).toBe("Hi");
    expect(payload.websiteUrl).toBe("https://a.io");
    expect(payload.avatarImage).toBe("new.png");
  });
});
