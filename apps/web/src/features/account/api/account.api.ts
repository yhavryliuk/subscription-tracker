import { useQuery } from "@tanstack/react-query";
import {
  MySessionsDocument,
} from "@/shared/api/graphql/graphqlApi";
import { safeGraphqlFetch } from "@/shared/api/graphql/safeGraphqlFetch";

export const useMySessions = (enabled = true) => {
  return useQuery({
    queryKey: ["mySessions"],
    enabled,
    retry: false,
    staleTime: 10_000,
    queryFn: () =>
      safeGraphqlFetch(MySessionsDocument, undefined, {
        auth: true,
      }),
    refetchOnWindowFocus: false,
  });
};
