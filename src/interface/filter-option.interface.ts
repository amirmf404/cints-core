import { FilterOperation } from "../enum/filter-operation.enum";
export interface FilterOption {
  field: string;
  operation: FilterOperation;
  value:
    | number
    | string
    | Date
    | number[]
    | string[]
    | boolean
    | Record<string, any>;
}
