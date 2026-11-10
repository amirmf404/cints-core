import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinEmail({ defaultValue }: { defaultValue?: string } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Email;
      field.defaultValue = defaultValue;
    });
  };
}
