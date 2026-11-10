import { updateCinField } from "../utils/utils";
import { CinFieldType } from "../enum/cin-field-type.enum";

export function CinId(
  // `showOnIndex` is accepted for backwards compatibility, it is not used.
  { showOnIndex }: { showOnIndex?: boolean } = { showOnIndex: true }
) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.type = CinFieldType.Identifier;
    });
  };
}
