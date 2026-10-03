export async function confirmEmailOutcome(confirm: () => Promise<unknown>): Promise<"confirmed" | "invalid"> {
  try {
    await confirm();
    return "confirmed";
  } catch {
    return "invalid";
  }
}

const tokenIn = (params: string): string | null => new URLSearchParams(params).get("token") || null;

export function readConfirmToken(search: string, hash: string): string | null {
  return tokenIn(hash.replace(/^#/, "")) ?? tokenIn(search);
}
