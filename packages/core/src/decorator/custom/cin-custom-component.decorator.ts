import { updateCinMetaData } from "../../utils/utils";
import { CinCustomComponentInterface } from "../../interface/cin-custom-component.interface";

export function CinCustomComponent(
  customComponent: CinCustomComponentInterface
) {
  return (constructor: Function): void => {
    updateCinMetaData(constructor, (metadata) => {
      metadata.customComponent = customComponent;
    });
  };
}
