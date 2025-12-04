import { getCinFieldObject, getCinMetaData, setCinMetaData } from "../utils/utils";
import { set } from "lodash";

export function CinSearchable() {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    fieldObject.searchable = true;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}