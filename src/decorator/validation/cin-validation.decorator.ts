import { CrudActionsEnum } from "../../enum/crud-actions";
import { Schema, number, string, AnyObject } from "yup";
import { getCinFieldObject, getCinMetaData, setCinMetaData } from "../../utils/utils";
import { CinCrudModelMetadata } from "../../interface/cin-model-metadata.interface";

export function CinValidation(
  schema:
    | {
        [CrudActionsEnum.Create]?: AnyObject;
        [CrudActionsEnum.Update]?: AnyObject;
      }
    | AnyObject,
): PropertyDecorator {
  return (target: {} | any, name: PropertyKey) => {
    const objectTarget = name ? target.constructor : target;
    const object = getCinMetaData(objectTarget) ?? ({} as CinCrudModelMetadata);
    const field = getCinFieldObject(object, name);
    field.validation = schema;

    setCinMetaData(object, objectTarget);
  };
}
