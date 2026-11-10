import { CinModel } from "../model/cin-crud-model";
import { updateCinField } from "../utils/utils";

export function CinTabView({
  priority = 0,
  label,
  model,
}: {
  priority?: number;
  label: string;
  model: CinModel;
}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.tabView = { priority, label, model };
    });
  };
}
