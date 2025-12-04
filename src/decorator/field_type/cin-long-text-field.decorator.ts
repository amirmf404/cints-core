import {
  setCinDefaultNameField,
  getCinFieldObject,
  getCinMetaData,
  setCinMetaData,
} from "../../utils/utils";
import { set } from "lodash";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinEditorParser } from "../../enum/cin-text-mode.enum";
import { CinTextFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinLongText(
  {
    defaultValue,
    parser,
  }: { defaultValue?: string; parser: CinEditorParser } = {
    parser: CinEditorParser.RAW,
  }
) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinTextFieldMetadata>(object, name);

    fieldObject.type = CinFieldType.LongText;
    fieldObject.defaultValue = defaultValue;
    fieldObject.textEditorParser = parser;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
