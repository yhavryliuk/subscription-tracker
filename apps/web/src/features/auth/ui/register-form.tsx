'use client';

import { useRegisterForm } from "@/features/auth/register/model/useRegisterForm";

export type RegisterFormProps = {
    onRegistrationSubmit: (values: {
        email: string;
        name: string;
        password: string;
    }) => void;
    loading?: boolean;
};

export function RegisterForm({ onRegistrationSubmit, loading }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useRegisterForm();

    return (
        <form onSubmit={handleSubmit(onRegistrationSubmit)}>
            <input {...register('email')} placeholder="Email"/>
            {errors.email && <p>{errors.email.message}</p>}

            <input {...register('name')} placeholder="Name"/>
            {errors.name && <p>{errors.name.message}</p>}

            <input
                type="password"
                {...register('password')}
                placeholder="Password"
            />
            {errors.password && <p>{errors.password.message}</p>}

            <button disabled={loading}>Create account</button>
        </form>
    );
}
