"use client";

import { describeError } from "@medialane/ui";
import { useCallback, useEffect, useReducer } from "react";
import { getMedialaneClient } from "@/lib/medialane-client";
import { emailCodeReducer, initialEmailCodeState, type EmailCodeState } from "@/lib/email-code";

export interface EmailCode {
  state: EmailCodeState;
  setCode(code: string): void;
  send(to?: string): Promise<void>;
  verify(options?: { code?: string; after?: () => Promise<void> | void }): Promise<boolean>;
  markReady(): void;
}

export function useEmailCode(email: string | null): EmailCode {
  const [state, dispatch] = useReducer(emailCodeReducer, initialEmailCodeState);

  useEffect(() => {
    if (state.cooldown === 0) return;
    const id = setTimeout(() => dispatch({ type: "tick" }), 1000);
    return () => clearTimeout(id);
  }, [state.cooldown]);

  const send = useCallback(
    async (to = email) => {
      if (!to) return;
      dispatch({ type: "send-started" });
      try {
        await getMedialaneClient().api.requestEmailCode(to);
        dispatch({ type: "send-succeeded" });
      } catch (err) {
        dispatch({ type: "send-failed", message: describeError(err, "Couldn't send the code. Please try again.").message });
      }
    },
    [email],
  );

  const verify = useCallback<EmailCode["verify"]>(
    async ({ code, after } = {}) => {
      const toVerify = code ?? state.code;
      if (!email || toVerify.length !== 6) return false;
      dispatch({ type: "verify-started" });
      try {
        await getMedialaneClient().api.verifyEmailCode(email, toVerify);
        await after?.();
        return true;
      } catch (err) {
        dispatch({ type: "verify-failed", message: describeError(err, "Incorrect code. Please try again.").message });
        return false;
      }
    },
    [email, state.code],
  );

  return {
    state,
    setCode: (code) => dispatch({ type: "code-changed", code }),
    send,
    verify,
    markReady: () => dispatch({ type: "send-succeeded" }),
  };
}
