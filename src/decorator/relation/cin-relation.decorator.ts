import { set } from "lodash";
import {
  getCinFieldObject,
  getCinMetaData,
  setCinDefaultNameField,
  setCinMetaData,
} from "../../utils/utils";
import { CinModel } from "../../model/cin-crud-model";
import { isFunction } from "../../types/Identify.type";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinRelationFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinRelation(
  input:
    | CinModel
    | {
        discriminatorKey: string;
        fallbackValue: unknown;
        discriminators: Record<string, unknown>[];
      }
    | (() => void),
  useDataRepository?: boolean
) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinRelationFieldMetadata>(object, name);

    fieldObject.reference = (obj) => {
      if (input["discriminatorKey"] && input["discriminators"]) {
        if (
          input["discriminators"] &&
          input["discriminators"][obj[input["discriminatorKey"]]]
        ) {
          return input["discriminators"][obj[input["discriminatorKey"]]];
        } else {
          return input["fallbackValue"];
        }
      } else if (isFunction(input)) {
        return (input as () => void)();
      } else {
        return input;
      }
    };

    fieldObject.type = CinFieldType.Relation;
    fieldObject.useDataRepository = useDataRepository;
    fieldObject.discriminatorKey = input["discriminatorKey"]
      ? input["discriminatorKey"]
      : undefined;

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name);
  };
}
