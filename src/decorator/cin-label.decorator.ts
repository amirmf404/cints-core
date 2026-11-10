import { updateCinField } from "../utils/utils";

export function CinLabel(options?: { priority?: number; label?: string }) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField(target, name, (field, metadata) => {
      metadata.labels = metadata.labels ?? [];
      metadata.labels.push({
        priority: options?.priority ?? 0,
        label: options?.label ?? name.toString(),
      });
    });
  };
}
