import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinEditorParser } from "../../enum/cin-text-mode.enum";
import { CinTextFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinLongText({
  defaultValue,
  parser = CinEditorParser.RAW,
}: { defaultValue?: string; parser?: CinEditorParser } = {}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinTextFieldMetadata>(target, name, (field) => {
      field.type = CinFieldType.LongText;
      field.defaultValue = defaultValue;
      field.textEditorParser = parser;
    });
  };
}
