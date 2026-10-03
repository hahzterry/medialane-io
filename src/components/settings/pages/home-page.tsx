"use client";

import { AddressDisplay } from "@medialane/ui";
import { ImageIcon, LifeBuoy, Mail, Smartphone, User, Wallet } from "lucide-react";
import { SettingsGate, SettingsGroup, SettingsPage, SettingsRow } from "@/components/settings/settings-page";
import { useAccountEmail } from "@/hooks/use-account-email";
import { useCreatorProfile } from "@/hooks/use-profiles";
import { useMyUsernameClaim } from "@/hooks/use-username-claims";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { emailRow, usernameRow, walletRow } from "@/lib/settings/rows";

export default function SettingsHomePage() {
  const { address, isDeployed } = useWalletNativeSession();
  const { status: email } = useAccountEmail();
  const { username, claim } = useMyUsernameClaim();
  const { profile } = useCreatorProfile(address ?? undefined);

  return (
    <SettingsGate>
      <SettingsPage title="Settings" back={false}>
        {address ? (
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
            <div
              className="h-14 w-14 shrink-0 rounded-full bg-muted bg-cover bg-center"
              style={profile?.avatarImage ? { backgroundImage: `url(${JSON.stringify(profile.avatarImage)})` } : undefined}
              aria-hidden
            />
            <div className="min-w-0 space-y-1">
              <p className="truncate text-base font-semibold text-foreground">{profile?.name || "Add your name"}</p>
              <AddressDisplay address={address} chars={6} showCopy />
            </div>
          </div>
        ) : null}

        <SettingsGroup label="Account">
          <SettingsRow href="/settings/email" icon={Mail} label="Email" status={emailRow(email)} />
          <SettingsRow href="/settings/wallet" icon={Wallet} label="Wallet" status={walletRow(isDeployed)} />
        </SettingsGroup>

        <SettingsGroup label="Security">
          <SettingsRow href="/settings/devices" icon={Smartphone} label="Devices" />
          <SettingsRow href="/settings/recovery" icon={LifeBuoy} label="Recovery" />
        </SettingsGroup>

        <SettingsGroup label="Profile">
          <SettingsRow
            href="/settings/profile"
            icon={User}
            label="Username, name & links"
            status={usernameRow(username, claim?.status ?? null)}
          />
          <SettingsRow href="/settings/appearance" icon={ImageIcon} label="Avatar & theme" />
        </SettingsGroup>
      </SettingsPage>
    </SettingsGate>
  );
}
