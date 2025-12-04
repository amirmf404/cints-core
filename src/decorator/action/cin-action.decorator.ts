import { CinActionInterface } from "../../interface/actions.interface";
import { CinCrudModelMetadata } from "../../interface/cin-model-metadata.interface";
import { getCinMetaData, setCinMetaData } from "../../utils/utils";
import { set } from "lodash";
import { CinActionTypeEnum } from "../../enum/cin-actionType.enum";

export function CinAction(options: CinActionInterface) {
  return function (
    target: any,
    name?: string,
    descriptor?: PropertyDescriptor
  ) {
    if (typeof target !== "function") {
      throw new Error("action decorator must be used on a static method");
    }

    const object = getCinMetaData(target) || ({} as CinCrudModelMetadata);

    const actionType = name
      ? CinActionTypeEnum.rowActions
      : CinActionTypeEnum.modelActions;
    const actionMetadata = {
      icon: options.icon,
      name,
      label: options.label,
      DataRepository: target,
      run: name
        ? (...args: any[]) => descriptor?.value.apply(target, args)
        : (...args: any[]) => options.run.apply(target, args),
    };

    if (!object.actions?.[actionType]) {
      set(object, `actions.${actionType}`, []);
    }

    object.actions[actionType].push(actionMetadata);
    setCinMetaData(object, target);
  };
}
