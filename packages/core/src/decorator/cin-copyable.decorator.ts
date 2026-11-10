import { updateCinField, updateCinMetaData } from "../utils/utils";

export function CinCopyable() {
  return (target: {} | any, name?: PropertyKey): void => {
    if (name === undefined) {
      updateCinMetaData(target, (metadata) => {
        metadata.copyable = true;
      });
      return;
    }

    updateCinField(target, name, (field) => {
      field.copyable = true;
    });
  };
}
