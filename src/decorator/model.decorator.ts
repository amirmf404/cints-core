import { CrudModelOption } from "../interface/model-option";
import {
  extractModelName,
  getCinMetaData,
  pathNormalizer,
  setCinMetaData,
} from "../utils/utils";
import "reflect-metadata";
import * as _ from "lodash";
import { set, get, unset } from "lodash";
import {
  CinCrudModelMetadata,
  CinFieldMetadata,
  CrudDataRepository,
  PaginationOptions,
} from "src/interface";

export function CinCrudModel(
  options: CrudModelOption = {
    actionOptions: { flatRowAction: false, showActions: true },
    viewPageOptions: { enable: true },
    updateOptions: { enable: true },
    deleteOptions: { enable: true },
    createOptions: { enable: true },
  }
) {
  return (constructor: Function) => {
    const modelName = options.name ?? extractModelName(constructor.name);
    const path = options.path ?? pathNormalizer(modelName);
    let object = getCinMetaData(constructor) ?? {};
    const modelMetaData = getCinMetaData(constructor);

    set(object, "modelName", modelName);
    set(object, "path", path);
    set(object, "createOptions", options.createOptions);
    set(object, "updateOptions", options.updateOptions);
    set(object, "deleteOptions", options.deleteOptions);
    set(object, "viewPageOptions", options.viewPageOptions);
    set(object, "copyOptions", options.copyOptions);
    set(object, "indexPageOptions", options.indexPageOptions);
    set(
      object,
      "dataRepository",
      transformDataRepository(options?.dataRepository, modelMetaData)
    );
    set(object, "actionOptions", options.actionOptions);
    set(object, "selectedTable", options.selectedTable);
    set(object, "children", options.children);
    setCinMetaData(object, constructor);
  };
}

function extractClassFieldPath(modelMetaData: any) {
  return _.chain(modelMetaData.fields)
    .filter((field) => field.dataPath)
    .map((field) => [field.name, field.dataPath])
    .value();
}

function transformObjectToClass(entity: any, mapFieldPath: any[][]) {
  mapFieldPath.forEach(([key, value]) => {
    const fieldValue = _.get(entity, value);
    if (fieldValue) {
      set(entity, key, fieldValue);
      unset(entity, value);
    }
  });
  return entity;
}

function transformToObject(entity: any, mapFieldPath: any[][]) {
  let data = entity;
  Object.entries(entity).forEach(([key, value]) => {
    const dataPath = mapFieldPath.find((entry) => entry[0] === key)?.[1];
    if (dataPath) {
      unset(data, key);
      set(data, dataPath, value);
    }
  });
  return data;
}

function transformParamsField(items, mapFieldPathObject) {
  if (items) {
    return items.map((item) => {
      if (mapFieldPathObject[item.field]) {
        return { ...item, field: mapFieldPathObject[item.field] };
      }
      return item;
    });
  }
}

function transformDataRepository(
  dataRepository: CrudDataRepository,
  modelMetaData: CinCrudModelMetadata
) {
  const originalCreate = dataRepository?.create;
  const originalUpdate = dataRepository?.update;
  const originalFindById = dataRepository?.findById;
  const originalFindPaginate = dataRepository?.findPaginate;
  const originalDelete = dataRepository?.delete;

  (dataRepository ?? { create: undefined }).create = async ({ entity }) => {
    const mapFieldPath = extractClassFieldPath(modelMetaData);

    let data = transformToObject(entity, mapFieldPath);

    const response = await originalCreate.call(dataRepository, {
      entity: data,
    });

    return transformObjectToClass(response, mapFieldPath);
  };

  (dataRepository ?? { update: undefined }).update = async ({ entity }) => {
    const mapFieldPath = extractClassFieldPath(modelMetaData);

    let data = transformToObject(entity, mapFieldPath);

    const response = await originalUpdate.call(dataRepository, {
      entity: data,
      id: data.id,
    });

    return transformObjectToClass(response, mapFieldPath);
  };

  (dataRepository ?? { findPaginate: undefined }).findPaginate = async (
    params: PaginationOptions
  ) => {
    const mapFieldPath = extractClassFieldPath(modelMetaData);
    const mapFieldPathObject = Object.fromEntries(mapFieldPath);

    const filter = transformParamsField(params.filter, mapFieldPathObject);
    const search = transformParamsField(params.search, mapFieldPathObject);
    let sort;

    if (params.sortBy) {
      sort = params.sortBy.map((item) => {
        if (!item) return;
        const isDescending = item.charAt(0) === "-";
        const originalString = isDescending ? item.slice(1) : item;
        const mappedField = mapFieldPathObject[originalString];

        return mappedField
          ? isDescending
            ? `-${mappedField}`
            : mappedField
          : item;
      });
    }

    const response = await originalFindPaginate.call(dataRepository, {
      ...params,
      filter,
      search,
      sortBy: sort ? sort : params.sortBy,
    });
    if (response.items.length <= 0) return response;

    return {
      ...response,
      items: response.items.map((item) =>
        transformObjectToClass(item, mapFieldPath)
      ),
    };
  };

  (dataRepository ?? { findById: undefined }).findById = async (entity) => {
    const response = await originalFindById.call(dataRepository, entity);

    const mapFieldPath = extractClassFieldPath(modelMetaData);

    return transformObjectToClass(response, mapFieldPath);
  };

  return dataRepository;
}
