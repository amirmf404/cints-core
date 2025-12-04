import { getCinFieldObject, getCinMetaData, setCinMetaData } from "../utils/utils";
import { set } from "lodash";

export function CinSortable() {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    fieldObject.sortable = true;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}