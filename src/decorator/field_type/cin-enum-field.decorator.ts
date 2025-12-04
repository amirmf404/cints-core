import {
  setCinDefaultNameField,
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../../utils/utils";
import { set } from "lodash";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinEnumFieldMetadata } from "../../interface/cin-field-metadata.interface";
import { SeverityTypeEnum } from "src/enum/SeverityType.enum";

export function CinEnum(
  enumObject: Object,
  severity: SeverityTypeEnum = SeverityTypeEnum.null,
  { defaultValue }: { defaultValue?: Record<string | number, any> } = {}
) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinEnumFieldMetadata>(object, name);

    fieldObject.type = CinFieldType.Enum;
    fieldObject.enumOptions = enumObject;
    fieldObject.defaultValue = defaultValue;
    fieldObject.Severity = severity;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
