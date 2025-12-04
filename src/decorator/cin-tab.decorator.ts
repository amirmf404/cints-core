import {
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../utils/utils";
import { set } from "lodash";

export function CinTab({
  priority = 0,
  label,
}: {
  priority: number;
  label: string;
}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    let tab = {
      priority,
      label,
    };
    fieldObject.tab = tab;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}
