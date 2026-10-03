"use client";

import { ImageIcon, LifeBuoy, Mail, Smartphone, User, Wallet } from "lucide-react";
import { AccountHealth } from "@/components/settings/account-health";
import { PortfolioSnapshot, RewardsSnapshot } from "@/components/settings/snapshots";
import { SettingsGate, SettingsGroup, SettingsPage, SettingsRow } from "@/components/settings/settings-page";
import { useAccountEmail } from "@/hooks/use-account-email";
import { useCreatorProfile } from "@/hooks/use-profiles";
import { useSecurityStatus } from "@/hooks/use-security-status";
import { useCollectionsByOwner } from "@/hooks/use-collections";
import { useTokensByOwner } from "@/hooks/use-tokens";
import { useUserOrders } from "@/hooks/use-orders";
import { useMyUsernameClaim } from "@/hooks/use-username-claims";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";
import { profileChecklist, securityChecklist } from "@/lib/settings/health";
import { emailRow, usernameRow, walletRow } from "@/lib/settings/rows";

export default function SettingsHomePage() {
  const { address, isDeployed } = useWalletNativeSession();
  const { status: email } = useAccountEmail();
  const { username, claim } = useMyUsernameClaim();
  const { profile } = useCreatorProfile(address ?? undefined);
  const { devices, guardians } = useSecurityStatus(address);
  const { tokens } = useTokensByOwner(address ?? null, 1, 100);
  const { orders } = useUserOrders(address ?? null);
  const { collections } = useCollectionsByOwner(address ?? null);

  const activeListings = orders.filter((o) => o.status === "ACTIVE" && o.offer.itemType !== "ERC20");
  const security = securityChecklist({ email, walletDeployed: isDeployed, devices, guardians });
  const profileItems = profileChecklist({
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
    avatarImage: profile?.avatarImage ?? "",
    username,
    hasLinks: Boolean(profile?.websiteUrl || profile?.twitterUrl || profile?.discordUrl || profile?.telegramUrl),
  });

  return (
    <SettingsGate>
      <SettingsPage
        title="Settings"
        subtitle="Your public profile and your account."
        back={false}
        aside={
          <>
            <AccountHealth security={security} profile={profileItems} />
            <PortfolioSnapshot assets={tokens.length} listings={activeListings.length} collections={collections.length} />
            <RewardsSnapshot address={address} />
          </>
        }
      >
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
