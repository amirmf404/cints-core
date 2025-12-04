import { CrudActionsEnum } from "src/enum";

export type CinExposeItem=(
  | CrudActionsEnum
  | {
      action: CrudActionsEnum;
      condition?: (formValue: Record<string, unknown>) => boolean;
    }
);
export type CinExposeOption = CinExposeItem[];
