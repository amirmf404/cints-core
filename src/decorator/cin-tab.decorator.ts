import { updateCinField } from "../utils/utils";

export function CinTab({
  priority = 0,
  label,
}: {
  priority?: number;
  label: string;
}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.tab = { priority, label };
    });
  };
}
