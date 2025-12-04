import {
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../utils/utils";
import { set } from "lodash";

export function CinCopyable() {
  return (target: {} | any, name?: PropertyKey) => {
    let objectTarget = name ? target.constructor : target;
    let object = getCinMetaData(objectTarget) ?? {};

    if (!name) {
      set(object, "copyable", true);
      setCinMetaData(object, target);
    } else {
      let fieldObject = getCinFieldObject(object, name);
      fieldObject.copyable = true;
      set(object, `fields.${name.toString()}`, fieldObject);
      setCinMetaData(object, target.constructor);
    }
  };
}
