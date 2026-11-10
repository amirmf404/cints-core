import { CrudActionsEnum } from "../../enum/crud-actions";
import { AnyObject } from "yup";
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
