import { get } from "lodash";
import { CinCrudModelMetadata } from "../interface/cin-model-metadata.interface";
import {
  CinBaseFieldMetadata,
  CinFieldMetadata,
} from "../interface/cin-field-metadata.interface";

export function extractModelName(input: string): string {
  return input.replace(/Model$/, "");
}
export function pathNormalizer(input: string): string {
  return input
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/^-/, "");
}
export function setCinMetaData(object, target): void {  
  Reflect.defineMetadata(`_cints_metadata:${target.name}`, object, target);
}

export function getCinMetaData(target): CinCrudModelMetadata {
  return Reflect.getMetadata(`_cints_metadata:${target.name}`, target);
}

export function getCinFieldObject<
  T extends CinBaseFieldMetadata = CinFieldMetadata,
>(object, name: PropertyKey): T {
  return get(object, `fields.${name.toString()}`) ?? ({} as T);
}

export function setCinDefaultNameField(object, name) {
  const fieldObject = getCinFieldObject(object, name);
  fieldObject.name = name.toString();
  fieldObject.label = name.toString();
}
