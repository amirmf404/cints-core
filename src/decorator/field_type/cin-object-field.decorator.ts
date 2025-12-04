import { set } from "lodash";
import {
  getCinFieldObject,
  getCinMetaData,
  setCinDefaultNameField,
  setCinMetaData,
} from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinModel } from "../../model/cin-crud-model";
import { CinObjectFieldMetadata } from "../../interface/cin-field-metadata.interface";
export function CinObject({
  model,
  tableMode,
}: {
  model: CinModel;
  tableMode: boolean;
}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinObjectFieldMetadata>(object, name);

    fieldObject.reference = model;
    fieldObject.tableMode = tableMode;
    fieldObject.type = CinFieldType.Object;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
