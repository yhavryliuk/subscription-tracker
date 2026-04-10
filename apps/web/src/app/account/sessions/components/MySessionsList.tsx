"use client";

import { useMySessionsQuery } from "@/shared/api/graphql/graphqlApi";

export default function MySessionsList() {
  const { data, isLoading, isError, error } = useMySessionsQuery(undefined, {
    // Keep the token fresh: refetch if page regains focus after an expiry
    refetchOnWindowFocus: true,
    retry: 1,
  });

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading sessions…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        {(error as Error)?.message ?? "Failed to load sessions"}
      </p>
    );
  }

  const sessions = data?.mySessions ?? [];

  if (!sessions.length) {
    return <p className="text-sm text-gray-400">No active sessions found.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {sessions.map((session) => (
        <li
          key={session.id}
          className="border rounded-md p-4 flex flex-col gap-1 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {session.device ?? "Unknown device"}
            </span>
            {session.isCurrent && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                Current
              </span>
            )}
          </div>

          {session.userAgent && (
            <span className="text-gray-500 text-xs truncate">
              {session.userAgent}
            </span>
          )}

          <span className="text-gray-400 text-xs">
            Created:{" "}
            {new Date(session.createdAt as string).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
