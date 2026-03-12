import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { type GraphQLError, print } from "graphql";
import { LoginDocument } from "@/shared/api/graphql/graphqlApi";
import { setAccessToken } from "@/shared/lib/auth";

export async function graphqlFetch<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  headers?: Record<string, string>,
): Promise<{
  data: T;
  response: Response;
}> {
  const endpoint =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql";
  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
  });

  const json = await res.json();

  if (json.errors) {
    const unauth = json.errors.some(
      (e: GraphQLError) => e.extensions?.code === "UNAUTHENTICATED",
    );
    if (unauth) throw new Error("UNAUTHENTICATED");
    throw json.errors;
  }

  const authHeader = res.headers.get("Authorization");
  if (authHeader !== null) {
    setAccessToken(authHeader.slice(7));
  }

  return { data: json.data, response: res };
}
