import { setExpose } from "../../utils/cin-set-expose.utils";
import { CrudActionsEnum } from "../../enum/crud-actions";
import {
  CinExposeItem,
  CinExposeOption,
} from "../../types/CinExposeOption.type";

export function isCrudActionEnum(
  value: CinExposeItem
): value is CrudActionsEnum {
  return typeof value === "string";
}

export function normalizeExposeOption(crudActions?: CinExposeOption) {
  return (crudActions ?? Object.values(CrudActionsEnum)).map((item) =>
    isCrudActionEnum(item) ? { action: item } : item
  );
}

export function CinExpose(
  crudActions?: CinExposeOption
): PropertyDecorator & ClassDecorator {
  return setExpose({
    value: true,
    crudActions: normalizeExposeOption(crudActions),
  });
}
