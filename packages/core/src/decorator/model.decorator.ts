import _ from "lodash";
import { CrudModelOption } from "../interface/model-option";
import {
  extractModelName,
  pathNormalizer,
  updateCinMetaData,
} from "../utils/utils";
import { CinCrudModelMetadata } from "../interface/cin-model-metadata.interface";
import { CrudDataRepository } from "../interface/data-repository";
import { PaginationOptions } from "../interface/pagination-options.interface";

/** Used when `@CinCrudModel()` is called without any options. */
const DEFAULT_OPTIONS: CrudModelOption = {
  actionOptions: { flatRowAction: false, showActions: true },
  viewPageOptions: { enable: true },
  updateOptions: { enable: true },
  deleteOptions: { enable: true },
  createOptions: { enable: true },
};

export function CinCrudModel(options: CrudModelOption = DEFAULT_OPTIONS) {
  return (constructor: Function): void => {
    const modelName = options.name ?? extractModelName(constructor.name);
    const path = options.path ?? pathNormalizer(modelName);

    updateCinMetaData(constructor, (metadata) => {
      metadata.modelName = modelName;
      metadata.path = path;
      metadata.fields = metadata.fields ?? {};

      // A page or action that is left out of `options` is disabled.
      metadata.createOptions = options.createOptions ?? { enable: false };
      metadata.updateOptions = options.updateOptions ?? { enable: false };
      metadata.deleteOptions = options.deleteOptions ?? { enable: false };
      metadata.viewPageOptions = options.viewPageOptions ?? { enable: false };
      metadata.actionOptions = options.actionOptions ?? {
        flatRowAction: false,
        showActions: false,
      };
      metadata.actions = {
        rowActions: metadata.actions?.rowActions ?? [],
        modelActions: metadata.actions?.modelActions ?? [],
      };

      metadata.copyOptions = options.copyOptions;
      metadata.indexPageOptions = options.indexPageOptions;
      metadata.selectedTable = options.selectedTable;
      metadata.children = options.children;
      metadata.labels = [...(options.labels ?? []), ...(metadata.labels ?? [])];
      if (options.icon !== undefined) metadata.icon = options.icon;

      metadata.dataRepository = transformDataRepository(
        options.dataRepository,
        metadata
      );
    });
  };
}

type FieldPath = [field: string, dataPath: string];

function extractClassFieldPath(modelMetaData: CinCrudModelMetadata) {
  return Object.values(modelMetaData?.fields ?? {})
    .filter((field) => field.dataPath)
    .map((field): FieldPath => [field.name, field.dataPath]);
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

/**
 * Sets `value` at `path` without changing any object that `root` shares with
 * the entity it was copied from: plain objects and arrays on the way are
 * copied before they are written to.
 */
function setPath(root: Record<string, any>, path: string, value: unknown) {
  const keys = _.toPath(path);
  let node = root;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      node[key] = value;
      return;
    }

    const next = node[key];
    if (Array.isArray(next)) node[key] = [...next];
    else if (_.isPlainObject(next)) node[key] = { ...next };
    else if (!isObject(next)) node[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};

    node = node[key];
  });
}

/** Removes `path` and every plain object on the way that it leaves empty. */
function unsetPath(root: Record<string, any>, path: string) {
  const keys = _.toPath(path);

  for (let length = keys.length; length > 0; length--) {
    _.unset(root, keys.slice(0, length));

    const parent = length > 1 ? _.get(root, keys.slice(0, length - 1)) : root;
    if (parent === root || !_.isPlainObject(parent) || !_.isEmpty(parent)) {
      return;
    }
  }
}

/** Moves nested payload values back onto the model fields (response side). */
function transformObjectToClass(entity: any, mapFieldPath: FieldPath[]) {
  if (!isObject(entity)) return entity;

  mapFieldPath.forEach(([field, dataPath]) => {
    const fieldValue = _.get(entity, dataPath);
    if (fieldValue === undefined) return;

    // Remove the nested value first: when the path starts with the field
    // name (`company` -> `company.id`), removing it afterwards would delete
    // a property of the value that was just assigned.
    unsetPath(entity, dataPath);
    entity[field] = fieldValue;
  });
  return entity;
}

/** Moves model fields to their data paths (request side). */
function transformToObject(entity: any, mapFieldPath: FieldPath[]) {
  if (!isObject(entity) || mapFieldPath.length === 0) return entity;

  // Work on a copy, the entity usually is the form state of the caller.
  const data = { ...entity };
  const moved = mapFieldPath.filter(([field]) =>
    Object.prototype.hasOwnProperty.call(entity, field)
  );

  moved.forEach(([field]) => delete data[field]);
  moved.forEach(([field, dataPath]) => setPath(data, dataPath, entity[field]));
  return data;
}

function transformParamsField<T extends { field: string }>(
  items: T[] | undefined,
  mapFieldPathObject: Record<string, string>
): T[] | undefined {
  return items?.map((item) =>
    mapFieldPathObject[item?.field]
      ? { ...item, field: mapFieldPathObject[item.field] }
      : item
  );
}

function transformSortBy(
  sortBy: string[] | undefined,
  mapFieldPathObject: Record<string, string>
) {
  return sortBy?.map((item) => {
    if (!item) return item;

    const isDescending = item.charAt(0) === "-";
    const mappedField = mapFieldPathObject[isDescending ? item.slice(1) : item];

    if (!mappedField) return item;
    return isDescending ? `-${mappedField}` : mappedField;
  });
}

/**
 * Returns a repository that applies the `@CinDataPath` mappings of the model
 * around the methods of `dataRepository`. The given repository is not
 * changed: the result delegates to it and every method is called with the
 * original repository as `this`.
 */
function transformDataRepository(
  dataRepository: CrudDataRepository | undefined,
  modelMetaData: CinCrudModelMetadata
): CrudDataRepository | undefined {
  if (!dataRepository) return dataRepository;

  const repository: CrudDataRepository = Object.create(dataRepository);
  const has = (method: keyof CrudDataRepository) =>
    typeof dataRepository[method] === "function";

  if (has("create")) {
    repository.create = async (params) => {
      const mapFieldPath = extractClassFieldPath(modelMetaData);

      const response = await dataRepository.create({
        ...params,
        entity: transformToObject(params?.entity, mapFieldPath),
      });

      return transformObjectToClass(response, mapFieldPath);
    };
  }

  if (has("update")) {
    repository.update = async (params) => {
      const mapFieldPath = extractClassFieldPath(modelMetaData);

      const response = await dataRepository.update({
        ...params,
        id: params?.id ?? params?.entity?.id,
        entity: transformToObject(params?.entity, mapFieldPath),
      });

      return transformObjectToClass(response, mapFieldPath);
    };
  }

  if (has("findPaginate")) {
    repository.findPaginate = async (params: PaginationOptions = {}) => {
      const mapFieldPath = extractClassFieldPath(modelMetaData);
      const mapFieldPathObject = Object.fromEntries(mapFieldPath);

      const response = await dataRepository.findPaginate({
        ...params,
        filter: transformParamsField(params.filter, mapFieldPathObject),
        search: transformParamsField(params.search, mapFieldPathObject),
        sortBy: transformSortBy(params.sortBy, mapFieldPathObject),
      });

      if (!Array.isArray(response?.items)) return response;

      return {
        ...response,
        items: response.items.map((item) =>
          transformObjectToClass(item, mapFieldPath)
        ),
      };
    };
  }

  if (has("findById")) {
    repository.findById = async (params) => {
      const response = await dataRepository.findById(params);

      return transformObjectToClass(
        response,
        extractClassFieldPath(modelMetaData)
      );
    };
  }

  if (has("delete")) {
    repository.delete = (params) => dataRepository.delete(params);
  }

  return repository;
}
