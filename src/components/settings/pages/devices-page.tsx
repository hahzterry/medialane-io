"use client";

import { DevicesSection } from "@/components/settings/devices-section";
import { SettingsGate, SettingsPage } from "@/components/settings/settings-page";
import { useWalletNativeSession } from "@/hooks/use-wallet-native-session";

export default function DevicesSettingsPage() {
  const { address } = useWalletNativeSession();
  return (
    <SettingsGate>
      <SettingsPage title="Devices">{address ? <DevicesSection walletAddress={address} /> : null}</SettingsPage>
    </SettingsGate>
  );
}
