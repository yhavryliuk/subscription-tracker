'use client';

import { useMySessions } from "@/features/account/api/account.api";

export default function MySessionsList() {
    const { data, error, isLoading } = useMySessions();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <ul>
            {data?.mySessions.map(session => (
                <li key={session.id}>{session.userAgent} {session.isCurrent ? '(current)' : undefined}</li>
            ))}
    </ul>
);
}
