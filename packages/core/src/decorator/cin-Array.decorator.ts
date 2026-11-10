import { updateCinField } from "../utils/utils";

export function CinArray() {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.isArray = true;
    });
  };
}
