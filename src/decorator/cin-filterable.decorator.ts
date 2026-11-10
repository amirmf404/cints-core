import { updateCinField } from "../utils/utils";

export function CinFilterable(targetField?: string) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.filterable = true;
      field.targetField = targetField;
    });
  };
}
