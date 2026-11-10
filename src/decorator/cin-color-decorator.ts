import { colorHandler } from "../types/color.type";
import { updateCinField, updateCinMetaData } from "../utils/utils";

/**
 * On a field: `handler` is required and becomes the field color handler.
 * On a method: the method itself becomes the row color handler of the model
 * and `handler` must not be passed.
 */
export function CinColor(handler?: colorHandler) {
  return function (
    target: {} | any,
    name: PropertyKey,
    descriptor?: PropertyDescriptor
  ): void {
    if (descriptor === undefined) {
      if (handler === undefined)
        throw new Error(
          "A handler must be defined when using the decorator on a field"
        );

      updateCinField(target, name, (field) => {
        field.colorHandler = handler;
      });
      return;
    }

    if (handler !== undefined)
      throw new Error(
        "Handler must not be defined when a decorator is used on a method"
      );

    updateCinMetaData(target, (metadata) => {
      metadata.colorHandler = (...args: [object]) =>
        descriptor.value.apply(target, args);
    });
  };
}
