"use client";

import { LifeBuoy } from "lucide-react";
import { GuardianRecoverySection } from "@/components/settings/guardian-recovery-section";
import { SettingsGate, SettingsPage } from "@/components/settings/settings-page";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";

export default function RecoverySettingsPage() {
  const { address } = useWalletNativeSession();
  return (
    <SettingsGate>
      <SettingsPage
        title="Recovery"
        subtitle="How to get back in if you lose every device."
        icon={<LifeBuoy className="h-4 w-4 text-white" />}
      >
        {address ? <GuardianRecoverySection walletAddress={address} /> : null}
      </SettingsPage>
    </SettingsGate>
  );
}
