import { setExpose } from "../../utils/cin-set-expose.utils";
import { CrudActionsEnum } from "../../enum/crud-actions";
import { CinExposeItem, CinExposeOption } from "src/types/CinExposeOption.type";

export function isCrudActionEnum(value: CinExposeItem): value is CrudActionsEnum {
  return !Object.keys(value).includes("action");
}

export function CinExpose(crudActions?: CinExposeOption): PropertyDecorator & ClassDecorator {
  return setExpose({
    value: true,
    crudActions: (crudActions ?? Object.values(CrudActionsEnum).map((a) => ({ action: a }))).map((a) =>
      isCrudActionEnum(a)
        ? {
            action: a,
          }
        : a,
    ),
  });
}
