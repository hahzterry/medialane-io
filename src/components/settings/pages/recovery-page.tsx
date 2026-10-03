"use client";

import { GuardianRecoverySection } from "@/components/settings/guardian-recovery-section";
import { SettingsGate, SettingsPage } from "@/components/settings/settings-page";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";

export default function RecoverySettingsPage() {
  const { address } = useWalletNativeSession();
  return (
    <SettingsGate>
      <SettingsPage title="Recovery">{address ? <GuardianRecoverySection walletAddress={address} /> : null}</SettingsPage>
    </SettingsGate>
  );
}
