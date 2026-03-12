import { useMutation } from "@tanstack/react-query";
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  RegisterDocument,
  type RegisterMutation,
  type RegisterMutationVariables,
} from "@/shared/api/graphql/graphqlApi";
import { graphqlFetch } from "@/shared/api/graphql/graphqlFetch";

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
