import { CinActionInterface } from "../../interface/actions.interface";
import { updateCinMetaData } from "../../utils/utils";
import { CinActionTypeEnum } from "../../enum/cin-actionType.enum";

/**
 * On a static method: registers a row action that calls the method.
 * On the class: registers a model action that calls `options.run`.
 */
export function CinAction(options: CinActionInterface) {
  return function (
    target: any,
    name?: string,
    descriptor?: PropertyDescriptor
  ): void {
    if (typeof target !== "function") {
      throw new Error("action decorator must be used on a static method");
    }

    const isRowAction = name !== undefined;
    const actionType = isRowAction
      ? CinActionTypeEnum.rowActions
      : CinActionTypeEnum.modelActions;

    let run: CinActionInterface["run"];
    if (isRowAction) {
      run = (...args: unknown[]) =>
        (descriptor?.value ?? target[name]).apply(target, args);
    } else if (options.run) {
      run = (...args: unknown[]) => options.run.apply(target, args);
    }

    updateCinMetaData(target, (metadata) => {
      metadata.actions = {
        rowActions: metadata.actions?.rowActions ?? [],
        modelActions: metadata.actions?.modelActions ?? [],
      };
      metadata.actions[actionType].push({
        icon: options.icon,
        name: isRowAction ? name : options.name,
        label: options.label,
        DataRepository: target,
        run,
      });
    });
  };
}
