import { updateCinMetaData } from "../utils/utils";

export function CinExport({
  enable = true,
  path,
}: { enable?: boolean; path?: string } = {}) {
  return (target: {} | any, name?: PropertyKey): void => {
    updateCinMetaData(target, (metadata) => {
      metadata.export = { enable, path };
    });
  };
}
