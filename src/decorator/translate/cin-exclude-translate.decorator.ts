import { CinTranslateEnum } from "../../enum/cin-translate.enum";
import { setTranslate } from "../../utils/cin-set-translate.utils";

export function CinExcludeTranslate(
  translate: CinTranslateEnum[] = Object.values(CinTranslateEnum)
): PropertyDecorator & ClassDecorator {
  return setTranslate({ value: false, translate: translate });
}
