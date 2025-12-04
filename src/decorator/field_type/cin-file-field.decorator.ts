import {
  setCinDefaultNameField,
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../../utils/utils";
import { set } from "lodash";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinFileType } from "../../enum/cin-file-type.enum";
import { CinFileFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinFile(
  {
    defaultValue,
    fileType,
    maxFileSize,
    run,
  }: {
    defaultValue?: File;
    fileType: CinFileType;
    maxFileSize: number;
    run?: Function;
  } = {
    fileType: CinFileType.ALL,
    maxFileSize: 1000000,
  }
) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinFileFieldMetadata>(object, name);

    fieldObject.type = CinFieldType.File;
    fieldObject.defaultValue = defaultValue;
    fieldObject.fileTypeMode = fileType;
    fieldObject.maxFileSize = maxFileSize;
    fieldObject.run = run;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
