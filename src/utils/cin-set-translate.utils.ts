import { updateCinField, updateCinMetaData } from "./utils";
import { CinFieldMetadata } from "../interface/cin-field-metadata.interface";
import { CinTranslateEnum } from "../enum/cin-translate.enum";

function setFieldTranslate(
  field: CinFieldMetadata,
  translate: CinTranslateEnum[],
  value: boolean
) {
  field.translate = field.translate ?? {};

  for (const key of translate) {
    // The first value set for a key wins, see `setFieldExpose`.
    if (key in field.translate) continue;
    field.translate[key] = value;
  }
}

export function setTranslate({
  value,
  translate,
}: {
  value: boolean;
  translate: CinTranslateEnum[];
}) {
  return (target: {} | any, name?: PropertyKey): void => {
    if (name === undefined) {
      updateCinMetaData(target, (metadata) => {
        for (const field of Object.values(metadata.fields ?? {})) {
          setFieldTranslate(field, translate, value);
        }
      });
      return;
    }

    updateCinField(target, name, (field) => {
      setFieldTranslate(field, translate, value);
    });
  };
}
