import {
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../utils/utils";
import { set } from "lodash";

export function CinFilterable(targetField?: string) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    fieldObject.filterable = true;
    fieldObject.targetField = targetField;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}
