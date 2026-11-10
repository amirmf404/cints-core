import { updateCinField } from "../utils/utils";

export function CinPresets<T>(
  data: Record<string, T> | (() => Record<string, T>)
) {
  return function (target: any, name: string | symbol): void {
    updateCinField(target, name, (field) => {
      field.presets = data;
    });
  };
}
