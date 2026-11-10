import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinFileType } from "../../enum/cin-file-type.enum";
import { CinFileFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinFile({
  defaultValue,
  fileType = CinFileType.ALL,
  maxFileSize = 1000000,
  run,
}: {
  defaultValue?: File;
  fileType?: CinFileType;
  maxFileSize?: number;
  run?: Function;
} = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinFileFieldMetadata>(target, name, (field) => {
      field.type = CinFieldType.File;
      field.defaultValue = defaultValue;
      field.fileTypeMode = fileType;
      field.maxFileSize = maxFileSize;
      field.run = run;
    });
  };
}
