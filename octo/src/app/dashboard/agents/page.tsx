import React from "react";
import {
  AgentsHeader,
  AgentsLoadingView,
  AgentsSearchBar,
  AgentsDataView
} from "./components/agents-view";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadSearchParams } from "./params";
import { SearchParams } from "nuqs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Props {
  searchParams: Promise<SearchParams>;
}
const Agents = async ({ searchParams }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/signin");
  }
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  return (
    <>
      <AgentsHeader />
      <AgentsSearchBar />

      {/* Only the data view is wrapped in Suspense */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <React.Suspense fallback={<AgentsLoadingView />}>
          <AgentsDataView />
        </React.Suspense>
      </HydrationBoundary>

    </>
  );
};

export default Agents;
