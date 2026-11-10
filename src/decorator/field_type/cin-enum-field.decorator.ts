import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinEnumFieldMetadata } from "../../interface/cin-field-metadata.interface";
import { SeverityTypeEnum } from "../../enum/SeverityType.enum";

export function CinEnum(
  enumObject: Object,
  severity: SeverityTypeEnum = SeverityTypeEnum.null,
  { defaultValue }: { defaultValue?: unknown } = {}
) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinEnumFieldMetadata>(target, name, (field) => {
      field.type = CinFieldType.Enum;
      field.enumOptions = enumObject;
      field.defaultValue = defaultValue;
      field.Severity = severity;
    });
  };
}
