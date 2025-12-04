import { getCinFieldObject, getCinMetaData, setCinMetaData } from "../utils/utils";
import { set } from "lodash";

export function CinField({ label }: { label?: string } = {}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);


    fieldObject.name = name.toString();
    fieldObject.label = label ?? fieldObject.name;
    
    set(object, `fields.${name.toString()}`, fieldObject);

    setCinMetaData(object, target.constructor);
  };
}
