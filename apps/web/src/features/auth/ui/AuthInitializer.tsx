"use client";

import { useEffect, useRef } from "react";
import { forceLogout, refreshAccessToken } from "@/shared/api/graphql-client";
import { setAccessToken, setInitialized } from "@/features/auth/model/auth.slice";
import { useAppDispatch } from "@/shared/hooks/store-hooks";

/**
 * Bootstraps auth state on the client.
 *
 * On first mount it attempts a silent token refresh using the browser's
 * `refreshToken` httpOnly cookie (sent automatically to the API).
 * - Success → stores token in-memory and marks user as authenticated
 * - Failure → calls forceLogout() to revoke the session and clear the
 *   refreshToken cookie, then marks user as unauthenticated. Clearing the
 *   cookie prevents the sign-in layout from bouncing back to the dashboard.
 *
 * Renders nothing.
 */
export const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    void (async () => {
      const token = await refreshAccessToken();
      if (token) {
        dispatch(setAccessToken(token));
      } else {
        await forceLogout();
        dispatch(setInitialized());
      }
    })();
  }, [dispatch]);

  return null;
};
