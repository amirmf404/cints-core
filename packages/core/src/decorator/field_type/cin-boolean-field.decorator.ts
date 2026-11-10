import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinBoolean({ defaultValue }: { defaultValue?: boolean } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Boolean;
      field.defaultValue = defaultValue;
    });
  };
}
