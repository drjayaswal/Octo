"use client";

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  BrainCog,
  CornerDownRightIcon,
  Edit,
  Plus,
  Search,
  Video,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { redirect } from "next/navigation";
import { createAgentSchema } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentGetOne } from "../type";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useAgentsFilter } from "../filters";

function CreateAgentForm({
  onSuccess,
  onCancel,
  initialValues,
  open,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: AgentGetOne;
  open: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.info(error.message);
        if (error.message == "FORBIDDEN") {
          setTimeout(() => {
            redirect("/dashboard/prices");
          }, 1000);
        }
      },
    })
  );
  const form = useForm<z.infer<typeof createAgentSchema>>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending;

  const onSubmit = (values: z.infer<typeof createAgentSchema>) => {
    if (isEdit) {
      alert("Update Agent");
    } else {
      createAgent.mutate(values);
    }
  };
  return (
    <Dialog
      open={!!open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        className="w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-6 rounded-3xl"
        onPointerDownOutside={onCancel}
        onInteractOutside={onCancel}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-lg lg:text-base font-semibold">
            Create New Agent
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4 sm:mt-5"
          >
            <div className="flex justify-center">
              <GeneratedAvatar
                seed={form.watch("name") || "agent"}
                variant="botttsNeutral"
                classname="size-12 sm:size-16 md:size-20 shadow-none hover:shadow-lg animate-bounce transition-shadow duration-200 cursor-pointer"
              />
            </div>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-base md:text-sm lg:text-xs">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="text-xs sm:text-base md:text-sm lg:text-xs py-2 border-2 focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-emerald-500 rounded-xl"
                      placeholder="Math Tutor, Code Assistant, or your agent's creative name!"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm md:text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-base md:text-sm lg:text-xs">
                    Instructions
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="text-xs sm:text-base md:text-sm lg:text-xs py-2 border-2 focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-emerald-500 rounded-xl"
                      placeholder="Describe what your agent should do. For example: 'Help me solve math problems in a fun way!'"
                    />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm md:text-xs" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onCancel();
                  }}
                  disabled={isPending}
                  className="rounded-lg text-sm sm:text-base md:text-sm lg:text-xs"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm sm:text-base md:text-sm lg:text-xs"
                disabled={isPending}
              >
                {isEdit ? "Update Agent" : "Create Agent"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AgentsViewProps {
  items: any[];
}

export const AgentsView = ({ items }: AgentsViewProps) => {
  return (
    <>
      {Array.isArray(items) && items.length > 0 ? (
        <div className="mt-5 space-y-1 bg-white p-3 rounded-xl shadow-md">
          {items.map((agent: any) => (
            <div
              key={agent.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer hover:shadow-sm"
            >
              <GeneratedAvatar
                seed={agent.name || "agent"}
                variant="botttsNeutral"
                classname="size-7 sm:size-10 shadow-none cursor-pointer border-2 border-black"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  {agent.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 truncate flex items-center gap-1">
                  <CornerDownRightIcon className="size-3 text-gray-400" />
                  {agent.instructions}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                    aria-label="Total Meetings"
                    disabled
                  >
                    <Video className="size-5" />
                  </Button>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full -mb-2.5 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-blue-500 text-white text-[10px] rounded-4xl px-2 py-1 whitespace-nowrap">
                    5 meetings
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  aria-label="Edit Agent"
                  onClick={() => {}}
                >
                  <Edit className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center py-12 sm:py-20 bg-white rounded-xl shadow-inner border-2 border-gray-200/50 min-h-[180px] sm:min-h-[240px]">
          <BrainCog />
          <div className="text-gray-700 text-base sm:text-lg font-semibold mb-1">
            No Such Agents
          </div>
          <div className="text-gray-400 text-xs sm:text-sm text-center max-w-xs">
            <span>
              <span className="inline-block mb-1 text-gray-500">
                Get started by creating your first agent.
              </span>
              <br />
              <span className="inline-flex items-center gap-1 mt-1">
                <span className="text-gray-400">Press</span>
                <kbd className="rounded px-1.5 py-0.5 bg-gray-100 border text-xs font-mono text-gray-700 shadow-inner">
                  ⌘
                </kbd>
                <span className="text-gray-400">+</span>
                <kbd className="rounded px-1.5 py-0.5 bg-gray-100 border text-xs font-mono text-gray-700 shadow-inner">
                  H
                </kbd>
                <span className="text-gray-400">to create a new agent</span>
              </span>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

// Static search component that doesn't re-render
export const AgentsSearchBar = () => {
  const [filters, setFilters] = useAgentsFilter();

  return (
    <div className="w-60 flex justify-center mt-4 bg-white items-center shadow-md rounded-xl pl-3 pr-1 mb-5">
      <Search />
      <Input
        type="text"
        placeholder="Search agents..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none text-xs sm:text-sm md:text-base px-3 py-2 transition-all shadow-none"
      />
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 text-xs text-emerald-600 hover:text-emerald-600 hover:bg-emerald-600/20 hover:shadow-inner rounded-lg"
        onClick={() => {
          setFilters({ search: "" });
        }}
      >
        Clear
      </Button>
    </div>
  );
};

export const AgentsDataView = () => {
  const [filters, setFilters] = useAgentsFilter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  return (
    <>
      <AgentsView items={data.items} />
      <AgentsPaginationView
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </>
  );
};

interface AgentsPaginationViewProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AgentsPaginationView = ({
  page,
  totalPages,
  onPageChange,
}: AgentsPaginationViewProps) => {
  return (
    <div className="w-full flex justify-between items-center mt-4 mb-5 px-2 sm:px-0">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-600 hover:bg-emerald-600/20 hover:shadow-inner rounded-lg disabled:opacity-50"
        onClick={() => {
          onPageChange(Math.max(1, page - 1));
        }}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden xs:inline">Previous</span>
      </Button>
      <span className="text-xs sm:text-sm text-gray-500">
        Page <span className="font-semibold">{page}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-600 hover:bg-emerald-600/20 hover:shadow-inner rounded-lg disabled:opacity-50"
        onClick={() => {
          onPageChange(Math.min(totalPages, page + 1));
        }}
        disabled={page === totalPages || totalPages === 0}
        aria-label="Next page"
      >
        <span className="hidden xs:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const AgentsLoadingView = () => {
  return (
    <div className="mt-5 space-y-1 bg-white p-3 rounded-xl shadow-md">
      {/* Generate 3 skeleton items */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg animate-pulse"
        >
          {/* Avatar skeleton */}
          <div className="size-7 sm:size-10 bg-gray-200 rounded-full flex-shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2">
            <div className="size-8 bg-gray-200 rounded" />
            <div className="size-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AgentsHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">My Agents</h2>
          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-emerald-700 bg-white hover:bg-emerald-600 active:text-emerald-700 active:bg-emerald-600 hover:text-white shadow-md font-medium rounded-2xl transition-colors duration-300 focus:outline-none"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Agent</span>
            <span className="inline sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <CreateAgentForm
        open={open}
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
      <Separator />
    </div>
  );
};
