"use client";

import { Button, Input } from "@repo/ui";
import { useRegisterForm } from "@/features/auth/register/model/useRegisterForm";

export type RegisterFormProps = {
  onRegistrationSubmit: (values: {
    email: string;
    name: string;
    password: string;
  }) => void;
  loading?: boolean;
};

export function SignUpForm({
  onRegistrationSubmit,
  loading,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit(onRegistrationSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Input
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
          placeholder="Email"
          type="email"
          autoComplete="email"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          placeholder="Name"
          autoComplete="name"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="password"
          {...register("password")}
          aria-invalid={Boolean(errors.password)}
          placeholder="Password"
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
        Create account
      </Button>
    </form>
  );
}
