import { CrudActionsEnum } from "../enum/crud-actions";
import { updateCinField, updateCinMetaData } from "./utils";
import { CinFieldMetadata } from "../interface/cin-field-metadata.interface";

interface ExposeAction {
  action: CrudActionsEnum;
  condition?: (formValue: Record<string, unknown>) => boolean;
}

function setFieldExpose(
  field: CinFieldMetadata,
  crudActions: ExposeAction[],
  value: boolean
) {
  field.expose = field.expose ?? {};

  for (const crudAction of crudActions) {
    // The first value set for an action wins: a field decorator is applied
    // before a class decorator, and the decorator closest to the property is
    // applied before the ones above it.
    if (!crudAction || crudAction.action in field.expose) continue;

    field.expose[crudAction.action] = {
      expose: value,
      condition: crudAction.condition,
    };
  }
}

export function setExpose({
  crudActions,
  value,
}: {
  value: boolean;
  crudActions: ExposeAction[];
}) {
  return (target: {} | any, name?: PropertyKey): void => {
    if (name === undefined) {
      updateCinMetaData(target, (metadata) => {
        for (const field of Object.values(metadata.fields ?? {})) {
          setFieldExpose(field, crudActions, value);
        }
      });
      return;
    }

    updateCinField(target, name, (field) => {
      setFieldExpose(field, crudActions, value);
    });
  };
}
