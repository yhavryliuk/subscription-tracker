import { useMutation, useQuery } from "@tanstack/react-query";
import { graphqlFetch } from "@/shared/api/graphql/graphqlFetch";
import {
  LoginDocument,
  LoginMutation,
  LoginMutationVariables,
  RegisterDocument,
  RegisterMutation,
  RegisterMutationVariables,
} from "@/shared/api/graphql/graphqlApi";

export const useRegister = () => {
  return useMutation({
    mutationFn: (variables: RegisterMutationVariables) =>
      graphqlFetch<RegisterMutation, RegisterMutationVariables>(
        RegisterDocument,
        variables,
      ),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (variables: LoginMutationVariables) =>
      graphqlFetch<LoginMutation, LoginMutationVariables>(
        LoginDocument,
        variables,
      ),
  });
};
