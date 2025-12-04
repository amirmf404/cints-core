import { CinEditorParser } from "../enum/cin-text-mode.enum";
import { CinFieldType } from "../enum/cin-field-type.enum";
import { CrudActionsEnum } from "../enum/crud-actions";
import { CinFileType } from "../enum/cin-file-type.enum";
import { AnyObject } from "yup";
import { CinDateStructure } from "../enum/cin-date-structure.enum";
import { CinModel } from "../model/cin-crud-model";
import { CinCustomComponentInterface } from "./cin-custom-component.interface";
import { CinTranslateEnum } from "../enum/cin-translate.enum";
import { SeverityTypeEnum } from "src/enum/SeverityType.enum";
import { colorHandler } from "src/types/color.type";

export interface CinBaseFieldMetadata {
  name: string;
  label: string;
  type: CinFieldType;
  sortable: boolean;
  searchable: boolean;
  filterable: boolean;
  copyable: boolean;
  targetField?: string;
  translate: { [l in CinTranslateEnum]?: boolean };
  expose: {
    [l in CrudActionsEnum]?: { expose: boolean; condition?: (formValue: Record<string, unknown>) => boolean };
  };
  validation?:
    | {
        [CrudActionsEnum.Create]?: AnyObject;
        [CrudActionsEnum.Update]?: AnyObject;
      }
    | AnyObject;
  defaultValue?: unknown;
  tab?: { priority: number; label: string };
  tabView?: { priority: number; label: string; model: CinModel };
  section?: { priority: number; label: string };
  isArray?: boolean;
  customComponentField?: CinCustomComponentInterface;
  dataPath: string;
  presets?: Record<string, unknown> | (() => Record<string, unknown>);
  colorHandler?: colorHandler;
}

export interface CinTextFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.LongText;
  textEditorParser?: CinEditorParser;
}

export interface CinRelationFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.Relation;
  reference: Function;
  useDataRepository?: boolean;
  discriminatorKey?: string;
}

export interface CinObjectFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.Object;
  tableMode: boolean;
  reference: CinModel;
}

export interface CinFileFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.File;
  fileTypeMode?: CinFileType;
  maxFileSize?: number;
  run: Function;
}
export interface CinEnumFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.Enum;
  Severity: SeverityTypeEnum;
  enumOptions: Record<any, any>;
}

export interface CinDateFieldMetadata extends CinBaseFieldMetadata {
  type: CinFieldType.Date;
  dateOptions: CinDateStructure;
}

export type CinFieldMetadata =
  | CinBaseFieldMetadata
  | CinTextFieldMetadata
  | CinFileFieldMetadata
  | CinRelationFieldMetadata
  | CinObjectFieldMetadata;
