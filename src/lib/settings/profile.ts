import type { ProfileForm } from "@/components/settings/types";

export const URL_FIELDS = ["websiteUrl", "twitterUrl", "discordUrl", "telegramUrl"] as const;

export const emptyProfileForm: ProfileForm = {
  name: "",
  bio: "",
  avatarImage: "",
  websiteUrl: "",
  twitterUrl: "",
  discordUrl: "",
  telegramUrl: "",
};

export const isValidUrl = (value: string): boolean =>
  !value || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("ipfs://");

export const invalidUrlFields = (form: ProfileForm): Array<(typeof URL_FIELDS)[number]> =>
  URL_FIELDS.filter((key) => !isValidUrl(form[key]));

export function profileFormFrom(profile: Partial<Record<keyof ProfileForm, string | null>>): ProfileForm {
  return {
    name: profile.name ?? "",
    bio: profile.bio ?? "",
    avatarImage: profile.avatarImage ?? "",
    websiteUrl: profile.websiteUrl ?? "",
    twitterUrl: profile.twitterUrl ?? "",
    discordUrl: profile.discordUrl ?? "",
    telegramUrl: profile.telegramUrl ?? "",
  };
}

export const profilePayload = (form: ProfileForm): Record<keyof ProfileForm, string | null> => ({
  name: form.name || null,
  bio: form.bio || null,
  avatarImage: form.avatarImage || null,
  websiteUrl: form.websiteUrl || null,
  twitterUrl: form.twitterUrl || null,
  discordUrl: form.discordUrl || null,
  telegramUrl: form.telegramUrl || null,
});
