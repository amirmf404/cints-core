import { getCinMetaData, setCinMetaData } from "../utils/utils";
import { set } from "lodash";

export function CinExport(
  { enable, path }: { enable?: boolean; path?: string } = {
    enable: true,
    path: undefined,
  }
) {
  return (target: {} | any, name?: PropertyKey) => {
    let objectTarget = name ? target.constructor : target;
    let object = getCinMetaData(objectTarget) ?? {};

    set(object, "export", { enable, path });
    setCinMetaData(object, target);
  };
}
