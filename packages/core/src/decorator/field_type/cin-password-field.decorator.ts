import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinPassword({ defaultValue }: { defaultValue?: string } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Password;
      field.defaultValue = defaultValue;
    });
  };
}
