import { CinCrudModelMetadata } from "../interface/cin-model-metadata.interface";
import { getCinMetaData, setCinMetaData } from "../utils/utils";
import _ from "lodash";

export class CinModel {
  static getMetaData(): CinCrudModelMetadata {
    return getCinMetaData(this);
  }

  static overrideMetaData(
    newMetaData: Partial<CinCrudModelMetadata> | undefined | null
  ) {
    if (!newMetaData) return this;

    this["version"] = (this["version"] || 0) + 1;
    const newClass = class extends this {};
    const oldMetaData = _.cloneDeep(getCinMetaData(this));

    Object.defineProperty(newClass, "name", {
      value: `${this.name}${this["version"]}`,
      writable: false,
    });

    _.assign(oldMetaData, newMetaData);

    setCinMetaData(oldMetaData, newClass);
    return newClass;
  }
}
