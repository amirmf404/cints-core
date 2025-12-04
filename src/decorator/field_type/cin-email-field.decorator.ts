import {
  setCinDefaultNameField,
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../../utils/utils";
import { set } from "lodash";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinEmail({ defaultValue }: { defaultValue?: boolean } = {}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);

    fieldObject.type = CinFieldType.Email;
    fieldObject.defaultValue = defaultValue;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
