import { createTRPCRouter } from "@/trpc/init";
import { agentRouter } from "@/app/dashboard/agents/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentRouter,
});

export type AppRouter = typeof appRouter;
