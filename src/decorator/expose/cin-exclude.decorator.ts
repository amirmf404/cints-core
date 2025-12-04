import { CinExposeOption } from "src/types/CinExposeOption.type";
import { CrudActionsEnum } from "../../enum/crud-actions";
import { setExpose } from "../../utils/cin-set-expose.utils";
import { isCrudActionEnum } from "./cin-expose.decorator";

export function CinExclude(
  crudActions: CinExposeOption = Object.values(CrudActionsEnum),
): PropertyDecorator & ClassDecorator {
  return setExpose({
    value: false,
    crudActions: (crudActions ?? Object.values(CrudActionsEnum).map((a) => ({ action: a }))).map((a) =>
      isCrudActionEnum(a)
        ? {
            action: a,
          }
        : a,
    ),
  });
}
