import { cinCustomComponentRoleEnum } from "src/enum";
import { CinCustomComponentInterface } from "./cin-custom-component.interface";

export interface baseFomOptions {
  enable: boolean;
  customComponent?: CinCustomComponentInterface;
  createRoute?: boolean;
  fullScreen?: boolean;
  role?: cinCustomComponentRoleEnum;
}

export interface updateOptions extends baseFomOptions {
  getValue?: boolean;
}
export interface createOptions extends baseFomOptions {}
