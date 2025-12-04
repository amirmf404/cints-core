import { applyDecorators } from "../../utils/cin-apply-decorators.utils";
import { CrudActionsEnum } from "../../enum/crud-actions";
import { CinExclude } from "./cin-exclude.decorator";
import { CinExpose } from "./cin-expose.decorator";

export function CinReadOnly(): PropertyDecorator & ClassDecorator {
  return applyDecorators(
    CinExclude([CrudActionsEnum.Create, CrudActionsEnum.Update]),
    CinExpose([CrudActionsEnum.View, CrudActionsEnum.Index])
  );
}
