import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";

export function CinCurrency({ defaultValue }: { defaultValue?: number | string } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Currency;
      field.defaultValue = defaultValue;
    });
  };
}
