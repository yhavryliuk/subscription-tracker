"use client";

import { RegisterForm } from "@/features/auth/ui/register-form";
import { useRegister } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const { mutate, isLoading } = useRegister();

  const handleRegister = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
    mutate({ input: values });
  };

  return <RegisterForm onRegistrationSubmit={handleRegister} />;
}
