import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinNumber({ defaultValue }: { defaultValue?: number } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Number;
      field.defaultValue = defaultValue;
    });
  };
}
