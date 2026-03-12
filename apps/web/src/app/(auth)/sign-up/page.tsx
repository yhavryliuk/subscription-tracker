"use client";

import { useRegister } from "@/features/auth/api/auth.api";
import { SignUpForm } from "@/features/auth/ui/signUpForm";

export default function RegisterPage() {
  const { mutate, isLoading } = useRegister();

  const handleRegister = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
    mutate({ input: values });
  };

  return <SignUpForm onRegistrationSubmit={handleRegister} />;
}
