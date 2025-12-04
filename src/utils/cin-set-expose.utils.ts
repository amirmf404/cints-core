import { chain } from "lodash";

import { CrudActionsEnum } from "../enum/crud-actions";
import { getCinFieldObject, getCinMetaData, setCinMetaData } from "./utils";
import { CinCrudModelMetadata } from "../interface/cin-model-metadata.interface";
import { CinFieldMetadata } from "src/interface";

function setFieldExpose(
  field: CinFieldMetadata,
  crudActions: {
    action: CrudActionsEnum;
    condition?: (formValue: Record<string, unknown>) => boolean;
  }[],
  value,
) {
  field.expose = field.expose ?? {};

  chain(crudActions)
    .compact()
    .filter((c) => !Object.keys(field.expose).includes(c.action))
    .forEach((c) => {
      field.expose[c.action] = {
        expose: value,
        condition: c.condition,
      };
    })
    .value();
}

export function setExpose({
  crudActions,
  value,
}: {
  value: boolean;
  crudActions: {
    action: CrudActionsEnum;
    condition?: (formValue: Record<string, unknown>) => boolean;
  }[];
}) {
  return (target: {} | any, name?: PropertyKey): void => {
    const objectTarget = name ? target.constructor : target;
    const object = getCinMetaData(objectTarget) ?? ({} as CinCrudModelMetadata);

    if (!name) {
      for (const field of Object.values(object.fields ?? [])) {
        setFieldExpose(field, crudActions, value);
      }
    } else {
      const field = getCinFieldObject(object, name);
      setFieldExpose(field, crudActions, value);
    }
    setCinMetaData(object, objectTarget);
  };
}
