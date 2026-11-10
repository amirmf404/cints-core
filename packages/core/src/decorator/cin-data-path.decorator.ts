import { updateCinField } from "../utils/utils";

export function CinDataPath(path: string) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.dataPath = path;
    });
  };
}
