import _ from "lodash";
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

/**
 * Metadata of every decorated class, keyed by the class itself. A WeakMap
 * keeps classes with the same name apart and lets unused classes be
 * garbage-collected.
 */
const metadataStore = new WeakMap<object, CinCrudModelMetadata>();

export function setCinMetaData(object, target): void {
  metadataStore.set(target, object);
}

/**
 * Returns the metadata stored on `target` itself. Metadata is never read
 * from a parent class, so a subclass cannot modify its parent's metadata.
 */
export function getCinMetaData(target): CinCrudModelMetadata {
  return metadataStore.get(target);
}

export function getCinFieldObject<
  T extends CinBaseFieldMetadata = CinFieldMetadata,
>(object, name: PropertyKey): T {
  return _.get(object, ["fields", name.toString()]) ?? ({} as T);
}

/**
 * Makes sure the field is registered on the metadata object and has a
 * `name` and a `label`. Values that are already set are kept.
 */
export function setCinDefaultNameField(object, name: PropertyKey): void {
  const key = name.toString();
  const fieldObject = getCinFieldObject(object, name);

  fieldObject.name = fieldObject.name ?? key;
  fieldObject.label = fieldObject.label ?? key;

  object.fields = object.fields ?? {};
  object.fields[key] = fieldObject;
}

/**
 * Resolves the class that owns the metadata for a decorator target.
 * Class decorators and static members receive the class itself, instance
 * members receive the prototype.
 */
export function resolveCinTarget(target): Function {
  return typeof target === "function" ? target : target.constructor;
}

/**
 * Loads the metadata of the class that owns `target`, lets `update` change
 * it and stores it again.
 */
export function updateCinMetaData(
  target,
  update: (metadata: CinCrudModelMetadata) => void
): void {
  const owner = resolveCinTarget(target);
  const metadata = getCinMetaData(owner) ?? ({} as CinCrudModelMetadata);

  update(metadata);
  setCinMetaData(metadata, owner);
}

/**
 * Registers the field `name` on the class that owns `target` (creating it
 * with a default name and label when needed) and lets `update` change it.
 */
export function updateCinField<
  T extends CinBaseFieldMetadata = CinFieldMetadata,
>(
  target,
  name: PropertyKey,
  update: (field: T, metadata: CinCrudModelMetadata) => void
): void {
  updateCinMetaData(target, (metadata) => {
    setCinDefaultNameField(metadata, name);
    update(metadata.fields[name.toString()] as T, metadata);
  });
}
