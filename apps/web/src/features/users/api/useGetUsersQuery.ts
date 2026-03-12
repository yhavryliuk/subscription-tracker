import { useQuery } from "@tanstack/react-query";
import { GetUsersDocument } from "@/shared/api/graphql/graphqlApi";
import { safeGraphqlFetch } from "@/shared/api/graphql/safeGraphqlFetch";

export function useGetUsersQuery(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    enabled,
    retry: false,
    queryFn: () =>
      safeGraphqlFetch(GetUsersDocument, undefined, {
        auth: true,
      }),
    refetchOnWindowFocus: false,
  });
}
