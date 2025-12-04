import { CinCustomComponentInterface } from "../../interface/cin-custom-component.interface";
import {
  setCinDefaultNameField,
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../../utils/utils";
import { set } from "lodash";

export function CinCustomFieldComponent(
  customComponentField: CinCustomComponentInterface,
) {
  return (target: {} | any, name?: PropertyKey): any => {
    let objectTarget = name ? target.constructor :  target;
    let object = getCinMetaData(objectTarget) ?? {};

    if (!name) {
      set(object, "customComponentField", customComponentField);
      setCinMetaData(object, target);
    } else {
      let fieldObject = getCinFieldObject(object, name);
      fieldObject.customComponentField = customComponentField;
      set(object, `fields.${name.toString()}`, fieldObject);
      setCinMetaData(object, target.constructor);
      setCinDefaultNameField(object, name);
    }
  };
}

