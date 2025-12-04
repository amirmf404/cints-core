import {
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../utils/utils";
import { set } from "lodash";

export function CinSection({
  priority = 0,
  label,
}: {
  priority: number;
  label: string;
}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    let section = {
      priority,
      label,
    };
    fieldObject.section = section;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}

