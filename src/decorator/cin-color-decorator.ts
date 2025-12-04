// import { set } from "lodash";
// import { CinModelIconOptions } from "../interface";
// import { CinModel, getCinFieldObject, getCinMetaData, setCinMetaData } from "@paybuy/cints-core";
import { CinCrudModelMetadata } from "src/interface";
import { colorHandler } from "src/types/color.type";
import { getCinFieldObject, getCinMetaData, setCinMetaData } from "src/utils";
import { set } from "lodash";

export function CinColor(handler?: colorHandler) {
  return function (
    target: unknown,
    name?: string,
    descriptor?: PropertyDescriptor
  ) {
    const object =
      getCinMetaData(target.constructor) || ({} as CinCrudModelMetadata);

    if (descriptor == undefined) {
      if (handler == undefined)
        throw new Error(
          "A handler must be defined when using the decorator on a field"
        );
      let fieldObject = getCinFieldObject(object, name);
      fieldObject.colorHandler = handler;
      set(object, `fields.${name.toString()}`, fieldObject);
    } else {
      if (handler != undefined)
        throw new Error(
          "Handler must not be defined when a decorator is used on a method"
        );

      object.colorHandler = (...args: any[]) =>
        descriptor?.value.apply(target, args);
    }
    setCinMetaData(object, target.constructor);
  };
}
