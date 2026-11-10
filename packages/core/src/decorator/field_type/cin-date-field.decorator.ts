import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinDateStructure } from "../../enum/cin-date-structure.enum";
import { CinDateFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinDate({
  defaultValue,
  dateOptions = CinDateStructure.Date,
}: { defaultValue?: Date; dateOptions?: CinDateStructure } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinDateFieldMetadata>(target, name, (field) => {
      field.type = CinFieldType.Date;
      field.defaultValue = defaultValue;
      field.dateOptions = dateOptions;
    });
  };
}
