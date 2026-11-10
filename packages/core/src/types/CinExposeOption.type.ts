import { CrudActionsEnum } from "../enum/crud-actions";

export type CinExposeItem =
  | CrudActionsEnum
  | {
      action: CrudActionsEnum;
      condition?: (formValue: Record<string, unknown>) => boolean;
    };
export type CinExposeOption = CinExposeItem[];
