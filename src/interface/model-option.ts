import { CinModel } from "../model";
import { CinCustomComponentInterface } from "./cin-custom-component.interface";
import { createOptions, updateOptions } from "./cin-form-options.interface";
import { LabelOptions } from "./cin-label.interface";
import { CopyOptions } from "./copy-options.interface";
import { CrudDataRepository } from "./data-repository";
import { IndexPageOptions } from "./index-page-options.interface";


export interface CrudModelOption {
  name?: string;
  path?: string;
  icon?: string;
  copyOptions?: CopyOptions;
  dataRepository?: CrudDataRepository;
  indexPageOptions?: IndexPageOptions;
  labels?: LabelOptions[];
  selectedTable?: boolean;
  children?: CinModel[];
  deleteOptions?: { enable: boolean };
  createOptions?: createOptions;
  updateOptions?: updateOptions;
  viewPageOptions?: {
    enable: boolean;
    customComponent?: CinCustomComponentInterface;
  };
  actionOptions?: { flatRowAction: boolean; showActions: boolean };
}