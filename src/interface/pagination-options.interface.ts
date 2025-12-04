import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { FilterOption } from "./filter-option.interface";

//TODO offset
export interface PaginationOptions {
  id?: string | number;
  sortBy?: string[];
  limit?: number;
  page?: number;
  filter?: FilterOption[];
  search?: FilterOption[];
  parent?: Record<any, any>;
}
