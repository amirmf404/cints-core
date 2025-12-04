import { getCinFieldObject, getCinMetaData, setCinDefaultNameField, setCinMetaData } from "../utils/utils";
import { get, set } from "lodash";
import { CinFieldType } from "../enum/cin-field-type.enum";

export function CinId(
  { showOnIndex }: { showOnIndex?: boolean } = { showOnIndex: true }
) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};

    let fieldObject = getCinFieldObject(object, name);

    fieldObject.type = CinFieldType.Identifier;

    set(object, `fields.${name.toString()}`, fieldObject);
    // set(object, "identifierField.field", name);
    // set(object, "identifierField.show", showOnIndex);

    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name)

  };
}
