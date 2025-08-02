import { DEFAULT_PAGE } from "@/lib/const";
import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

export const useAgentsFilterParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchParams = createLoader(useAgentsFilterParams);
