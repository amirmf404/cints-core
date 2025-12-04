import { set } from "lodash";
import { getCinFieldObject, getCinMetaData, setCinMetaData } from "src/utils";

export function CinPresets<T>(
  data: Record<string, T> | (() => Record<string, T>)
) {
  return function (target: any, name: string | symbol) {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);

    fieldObject.presets = data;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}
