"use client";

import { SignUpForm } from "@/features/auth/ui/signUpForm";

export default function RegisterPage() {

  const handleRegister = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
    // TODO
  };

  return <SignUpForm onRegistrationSubmit={handleRegister} />;
}
