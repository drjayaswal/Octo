"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Loading from "@/components/loading";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="space-y-4">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((agent: any) => (
          <div key={agent.id} className="rounded border p-4 shadow-sm bg-white">
            <div className="font-semibold text-lg mb-1">{agent.name}</div>{" "}
            <div className="text-xs text-gray-400">
              Created: {new Date(agent.createdAt).toLocaleString()}
              <br />
              Updated: {new Date(agent.updatedAt).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No agents found.</div>
      )}
    </div>
  );
};
export const AgentsLoadingView = () => {
  return <Loading />;
};
