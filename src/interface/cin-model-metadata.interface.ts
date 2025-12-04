import { CinFieldMetadata } from "./cin-field-metadata.interface";
import { CinCustomComponentInterface } from "./cin-custom-component.interface";
import { Actions } from "./actions.interface";
import { LabelOptions } from "./cin-label.interface";
import { CopyOptions } from "./copy-options.interface";
import { IndexPageOptions } from "./index-page-options.interface";
import { CrudDataRepository } from "./data-repository";
import { CinModel } from "../model";
import { createOptions, updateOptions } from "./cin-form-options.interface";
import { colorHandler } from "src/types/color.type";

interface CinModelMetadata {
  modelName: string; //! user
  path: string; //! user
}

export interface CinCrudModelMetadata extends CinModelMetadata {
  // identifierField: {
  //   field: string; //! id
  //   show: boolean; //! true
  // };
  copyOptions: CopyOptions;
  selectedTable?: boolean;
  fields: Record<string, CinFieldMetadata>;
  indexPageOptions?: IndexPageOptions;
  customComponent?: CinCustomComponentInterface;
  customComponentField?: CinCustomComponentInterface;
  copyable?: boolean;
  children?: CinModel[];
  export?: {
    enable: boolean;
    path: string;
  };

  updateOptions: updateOptions;
  createOptions: createOptions;

  viewPageOptions: {
    enable: boolean;
    customComponent?: CinCustomComponentInterface;
  };
  deleteOptions?: { enable: boolean };
  actionOptions: { flatRowAction: boolean; showActions: boolean };
  actions: Actions;
  dataRepository?: CrudDataRepository;
  labels: LabelOptions[];
  icon?: string;
  colorHandler?: colorHandler;
}
