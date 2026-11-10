import { CinCustomComponentInterface } from "../../interface/cin-custom-component.interface";
import { updateCinField, updateCinMetaData } from "../../utils/utils";

export function CinCustomFieldComponent(
  customComponentField: CinCustomComponentInterface
) {
  return (target: {} | any, name?: PropertyKey): void => {
    if (name === undefined) {
      updateCinMetaData(target, (metadata) => {
        metadata.customComponentField = customComponentField;
      });
      return;
    }

    updateCinField(target, name, (field) => {
      field.customComponentField = customComponentField;
    });
  };
}
