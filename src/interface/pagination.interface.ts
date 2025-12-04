import { CinModel } from "../model/cin-crud-model";
import { PaginationOptions } from "./pagination-options.interface";

export interface Pagination<T extends Record<string, unknown>> extends PaginationOptions {
  items: T[];
  itemCount: number;
  pageCount?: number;
}
