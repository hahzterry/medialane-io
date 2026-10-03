export async function confirmEmailOutcome(confirm: () => Promise<unknown>): Promise<"confirmed" | "invalid"> {
  try {
    await confirm();
    return "confirmed";
  } catch {
    return "invalid";
  }
}
