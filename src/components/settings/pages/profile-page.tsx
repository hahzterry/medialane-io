"use client";

import { useRouter } from "next/navigation";
import { AtSign, CheckCircle2, Clock, Loader2, User, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CopyLinkButton } from "@/components/settings/copy-link-button";
import { ProfileLivePreview } from "@/components/settings/profile-live-preview";
import { SettingsGate, SettingsPage, SettingsSection } from "@/components/settings/settings-page";
import { ClaimError, UsernameClaimInput } from "@/components/settings/username-claim-input";
import type { ProfileForm } from "@/components/settings/types";
import { useProfileForm } from "@/hooks/use-profile-form";
import { useUsernameClaimForm } from "@/hooks/use-username-claim-form";
import { isValidUrl, URL_FIELDS } from "@/lib/settings/profile";

const URL_KEYS = new Set<string>(URL_FIELDS);

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { address, isLoading, form, setField, saving, saveStatus, saveError, save } = useProfileForm();
  const username = useUsernameClaimForm();
  const { approvedUsername, claim } = username;

  const claimInput = (
    <div className="space-y-3">
      <UsernameClaimInput
        value={username.input}
        onChange={username.change}
        onCheck={username.check}
        onSubmit={username.submit}
        checkState={username.checkState}
        checkReason={username.checkReason}
        loading={username.claiming}
        disabled={!address}
      />
      {username.claimStatus === "success" ? (
        <p className="text-sm text-emerald-500">✓ Claim submitted — the Medialane DAO team will review it shortly.</p>
      ) : null}
      {username.claimStatus === "error" && username.claimError ? (
        <ClaimError error={username.claimError} onVerifyEmail={() => router.push("/settings/email")} />
      ) : null}
    </div>
  );

  const field = (key: keyof ProfileForm, label: string, placeholder = "") => {
    const invalid = URL_KEYS.has(key) && !isValidUrl(form[key]);
    return (
      <div className="space-y-1.5">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setField(key, e.target.value)}
          className={invalid ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {invalid ? <p className="text-xs text-destructive">Must start with http://, https://, or ipfs://</p> : null}
      </div>
    );
  };

  return (
    <SettingsGate>
      <SettingsPage
        title="Profile"
        subtitle="Your username, name and links."
        icon={<User className="h-4 w-4 text-white" />}
        aside={
          <ProfileLivePreview form={form} approvedUsername={approvedUsername} walletAddress={address} fallbackImage={undefined} />
        }
      >
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <SettingsSection icon={AtSign} title="Username" description="Claim a unique handle for your shareable profile URL.">
              {approvedUsername ? (
                <div className="flex items-start gap-3 rounded-xl border border-green-500/40 bg-green-500/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Username active</p>
                      <p className="mt-0.5 break-words text-sm text-muted-foreground">
                        Your profile is live at{" "}
                        <a href={`/creator/${approvedUsername}`} className="font-medium tabular-nums text-primary hover:underline">
                          medialane.io/creator/{approvedUsername}
                        </a>
                      </p>
                    </div>
                    <CopyLinkButton url={`https://www.medialane.io/creator/${approvedUsername}`} />
                  </div>
                </div>
              ) : null}

              {!approvedUsername && claim?.status === "PENDING" ? (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">Claim under review</p>
                      <Badge variant="outline" className="border-yellow-500/40 bg-yellow-500/10 text-[10px] text-yellow-700 dark:text-yellow-400">
                        Pending
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span className="font-medium tabular-nums text-foreground">@{claim.username}</span> is awaiting DAO review.
                      You&apos;ll be notified by email once processed.
                    </p>
                  </div>
                </div>
              ) : null}

              {!approvedUsername && claim?.status === "REJECTED" ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Claim rejected</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        <span className="tabular-nums text-foreground">@{claim.username}</span> was not approved.
                        {claim.adminNotes ? <span className="ml-1 italic">&ldquo;{claim.adminNotes}&rdquo;</span> : null}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">You can submit a new claim below.</p>
                    </div>
                  </div>
                  {claimInput}
                </div>
              ) : null}

              {!approvedUsername && !claim ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get a shareable URL like <span className="tabular-nums text-foreground">medialane.io/creator/yourname</span>.
                    Claims are reviewed by the Medialane DAO team to prevent impersonation.
                  </p>
                  {claimInput}
                </div>
              ) : null}
            </SettingsSection>

            <SettingsSection title="Identity" description="Your public profile">
              {field("name", "Name", "Your name")}
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setField("bio", e.target.value)}
                  rows={3}
                  placeholder="Tell the world about yourself and your work…"
                />
              </div>
            </SettingsSection>

            <SettingsSection title="Links" description="Your web presence">
              {field("websiteUrl", "Website", "https://…")}
              {field("twitterUrl", "Twitter / X", "https://twitter.com/…")}
              {field("discordUrl", "Discord", "https://discord.gg/…")}
              {field("telegramUrl", "Telegram", "https://t.me/…")}
            </SettingsSection>

            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Button onClick={save} disabled={saving || !address} className="w-full sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              {saveStatus === "saved" ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </span>
              ) : null}
              {saveStatus === "error" && saveError ? <span className="text-sm text-destructive">{saveError}</span> : null}
            </div>
          </>
        )}
      </SettingsPage>
    </SettingsGate>
  );
}
