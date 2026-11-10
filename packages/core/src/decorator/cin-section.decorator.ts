import { updateCinField } from "../utils/utils";

export function CinSection({
  priority = 0,
  label,
}: {
  priority?: number;
  label: string;
}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field) => {
      field.section = { priority, label };
    });
  };
}
