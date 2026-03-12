"use client";

import Link from "next/link";
import { useState } from "react";
import { setUserShortInfo } from "@/features/account/model/account.slice";
import { useLogin } from "@/features/auth/api/auth.api";
import { useAppDispatch } from "@/shared/hooks/store-hooks";
import { getAccessToken } from "@/shared/lib/auth";
import { decodeJwt } from "@/shared/lib/jwt";
import styles from "./signInForm.module.scss";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync } = useLogin();
  const dispatch = useAppDispatch();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutateAsync({
      input: {
        email,
        password,
      },
    });
    const accessToken = getAccessToken();
    if (accessToken) {
      const tokenData = decodeJwt<{ email: string }>(accessToken);
      if (tokenData !== null) {
        dispatch(
          setUserShortInfo({
            email: tokenData.email,
          }),
        );
      }
    }

    //console.log(result);
    //window.location.href = '/dashboard';
  }

  return (
    <div>
      <h1 className="text-center font-bold mb-2">Sign In Form</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-700 cursor-pointer p-1 rounded-sm"
        >
          Login
        </button>
      </form>
      <div className="text-sm flex gap-4 mt-4">
        <Link href="/account/sessions">Sessions Page</Link>
        <Link href="/account/dashboard">dashboard page</Link>
        <Link href="/dashboard/server-test">Server Page</Link>
      </div>
    </div>
  );
};
