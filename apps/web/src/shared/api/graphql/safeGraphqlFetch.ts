import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { CSRF_TOKEN } from "@libs/constants/cookies-keys";
import { CSRF_HEADERS_KEY } from "@libs/constants/headers-keys";
import {
  RefreshTokenDocument,
  type RefreshTokenMutation,
  type RefreshTokenMutationVariables,
} from "@/shared/api/graphql/graphqlApi";
import {
  getAccessToken,
  isAccessTokenExpired,
  setAccessToken,
} from "@/shared/lib/auth";
import { graphqlFetch } from "./graphqlFetch";

let refreshingToken: Promise<string> | null = null;

function getCsrfFromCookie(): string {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CSRF_TOKEN}=`))
      ?.split("=")[1] ?? ""
  );
}

async function refreshToken(): Promise<unknown> {
  if (!refreshingToken) {
    refreshingToken = graphqlFetch<
      RefreshTokenMutation,
      RefreshTokenMutationVariables
    >(RefreshTokenDocument, undefined, {
      [CSRF_HEADERS_KEY]: getCsrfFromCookie(),
    })
      .then((data) => {
        const authHeader = data.response?.headers?.get?.("authorization");
        if (authHeader) {
          const token = authHeader.replace("Bearer ", "");
          setAccessToken(token);
          return token;
        } else {
          throw new Error("Refresh failed: no accessToken");
        }
      })
      .finally(() => {
        refreshingToken = null;
      });
  }

  return refreshingToken;
}

export interface SafeGraphqlFetchOptions {
  auth?: boolean /* Is request need auth header  */;
}

export async function safeGraphqlFetch<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  options?: SafeGraphqlFetchOptions,
): Promise<T> {
  let token = getAccessToken();
  if (options?.auth) {
    // Check token
    if (!token || isAccessTokenExpired(token)) {
      await refreshToken();
      token = getAccessToken();
    }
  }

  try {
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const result = await graphqlFetch(document, variables, headers);
    return result.data;
  } catch (err: any) {
    if (err.message === "UNAUTHENTICATED" && options?.auth) {
      // In case when token expired while request in progress
      await refreshToken();
      const token = getAccessToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const result = await graphqlFetch(document, variables, headers);
      return result.data;
    }
    throw err;
  }
}
