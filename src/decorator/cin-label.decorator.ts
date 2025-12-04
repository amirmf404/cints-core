import { getCinMetaData, setCinMetaData } from "../utils/utils";
export function CinLabel(options?: { priority?: number; label?: string }) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor);
    if (!object.labels) {
      object.labels = [];
    }
    object.labels.push({ priority: options?.priority ?? 0, label: options?.label ?? name.toString() });
    setCinMetaData(object, target.constructor);
  };
}
