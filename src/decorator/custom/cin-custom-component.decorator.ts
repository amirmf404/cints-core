import { set } from "lodash";
import { getCinMetaData, setCinMetaData } from "../../utils/utils";
import { CinCustomComponentInterface } from "../../interface/cin-custom-component.interface";

export function CinCustomComponent(
  customComponent: CinCustomComponentInterface
) {
  return (constructor: () => void) => {
    const object = getCinMetaData(constructor) ?? {};
    set(object, "customComponent", customComponent);
    setCinMetaData(object, constructor);
  };
}
