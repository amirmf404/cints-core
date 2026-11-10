import { CinExposeOption } from "../../types/CinExposeOption.type";
import { setExpose } from "../../utils/cin-set-expose.utils";
import { normalizeExposeOption } from "./cin-expose.decorator";

export function CinExclude(
  crudActions?: CinExposeOption
): PropertyDecorator & ClassDecorator {
  return setExpose({
    value: false,
    crudActions: normalizeExposeOption(crudActions),
  });
}
