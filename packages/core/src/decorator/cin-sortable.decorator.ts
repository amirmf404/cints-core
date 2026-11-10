import { updateCinField } from "../utils/utils";

export function CinSortable() {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.sortable = true;
    });
  };
}
