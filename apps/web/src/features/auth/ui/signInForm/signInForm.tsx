"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/shared/api/graphql/graphqlApi";
import { tokenManager } from "@/shared/lib/token-manager";
import { setAccessToken } from "@/features/auth/model/auth.slice";
import { useAppDispatch } from "@/shared/hooks/store-hooks";
import styles from "./signInForm.module.scss";

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export const SignInForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutateAsync: login, isError, error } = useLoginMutation();

  const onSubmit = handleSubmit(async (values) => {
    await login({ input: values });

    // The fetcher captured the token in tokenManager after the login response
    const token = tokenManager.get();
    if (token) {
      dispatch(setAccessToken(token));

      // Persist token in the encrypted server-side cookie for SSR pages
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    }

    router.push("/account/dashboard");
  });

  return (
    <div>
      <h1 className="text-center font-bold mb-2">Sign In</h1>

      {isError && (
        <p className="text-red-500 text-sm mb-3 text-center">
          {(error as Error)?.message ?? "Invalid credentials"}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            className={styles.input}
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer p-1 rounded-sm"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="text-sm flex gap-4 mt-4">
        <Link href="/sign-up">Create account</Link>
      </div>
    </div>
  );
};
