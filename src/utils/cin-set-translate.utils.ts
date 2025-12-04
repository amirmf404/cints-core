import { chain } from "lodash";
import { CrudActionsEnum } from "../enum/crud-actions";
import { getCinFieldObject, getCinMetaData, setCinMetaData } from "./utils";
import { CinCrudModelMetadata } from "../interface/cin-model-metadata.interface";
import { CinTranslateEnum } from "../enum/cin-translate.enum";

function exposeComponent(field, translate, value) {
  field.translate = field.translate ?? {};

  chain(translate)
    .difference(Object.keys(field.translate))
    .forEach((c) => {
      field.translate[c] = value;
    })
    .value();
}
export function setTranslate({
  value,
  translate,
}: {
  value: boolean;
  translate: CinTranslateEnum[];
}) {
  return (target: {} | any, name?: PropertyKey): void => {
    const objectTarget = name ? target.constructor : target;
    const object = getCinMetaData(objectTarget) ?? ({} as CinCrudModelMetadata);

    if (!name) {
      for (const field of Object.values(object.fields ?? [])) {
        exposeComponent(field, translate, value);
      }
    } else {
      const field = getCinFieldObject(object, name);

      exposeComponent(field, translate, value);
    }
    setCinMetaData(object, objectTarget);
  };
}
