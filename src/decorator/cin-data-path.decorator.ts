import { set } from "lodash";
import { getCinFieldObject, getCinMetaData, setCinDefaultNameField, setCinMetaData } from "src/utils";

export function CinDataPath(path: string) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name)
    fieldObject.dataPath = path
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
