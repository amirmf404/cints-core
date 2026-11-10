import { updateCinField } from "../utils/utils";

/**
 * Marks a field as virtual: it is part of the model metadata but is not a
 * stored property of the entity.
 */
export function CinVirtualField() {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.virtual = true;
    });
  };
}
