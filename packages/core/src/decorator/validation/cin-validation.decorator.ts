import { CrudActionsEnum } from "../../enum/crud-actions";
import { AnyObject } from "../../types/any-object.type";
import { updateCinField } from "../../utils/utils";

export function CinValidation(
  schema:
    | {
        [CrudActionsEnum.Create]?: AnyObject;
        [CrudActionsEnum.Update]?: AnyObject;
      }
    | AnyObject
): PropertyDecorator {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.validation = schema;
    });
  };
}
