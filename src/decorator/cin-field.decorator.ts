import { updateCinField } from "../utils/utils";

export function CinField({ label }: { label?: string } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      if (label !== undefined) field.label = label;
    });
  };
}
