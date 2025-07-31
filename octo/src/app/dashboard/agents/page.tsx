import React from "react";
import { AgentsLoadingView, AgentsView } from "./components/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Loading from "@/components/loading";

const Agents = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <React.Suspense fallback={<AgentsLoadingView />}>
        <AgentsView />
      </React.Suspense>
    </HydrationBoundary>
  );
};

export default Agents;
