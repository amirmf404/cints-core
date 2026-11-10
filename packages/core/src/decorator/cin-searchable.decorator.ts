import { updateCinField } from "../utils/utils";

export function CinSearchable() {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.searchable = true;
    });
  };
}
