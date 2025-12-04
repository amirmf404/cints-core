import { CinModel } from "src/model";
import {
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../utils/utils";
import { set } from "lodash";

export function CinTabView({
  priority = 0,
  label,
  model
}: {
  priority: number;
  label: string;
  model: CinModel;
}) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject(object, name);
    let TabView = {
      priority,
      label,
      model
    };
    fieldObject.tabView = TabView;
    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
  };
}
