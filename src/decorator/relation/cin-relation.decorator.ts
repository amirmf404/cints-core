import { updateCinField } from "../../utils/utils";
import { CinModel } from "../../model/cin-crud-model";
import { isFunction } from "../../types/Identify.type";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinRelationFieldMetadata } from "../../interface/cin-field-metadata.interface";

export interface CinRelationDiscriminatorOptions {
  /** Property of the row whose value selects the model. */
  discriminatorKey: string;
  /** Model used when the row value matches none of `discriminators`. */
  fallbackValue?: unknown;
  /** Map from discriminator value to model. */
  discriminators: Record<string, unknown>;
}

export function CinRelation(
  input: CinModel | CinRelationDiscriminatorOptions | (() => unknown),
  useDataRepository?: boolean
) {
  const discriminatorKey: string | undefined =
    input?.["discriminatorKey"] || undefined;
  const discriminators: Record<string, unknown> | undefined =
    input?.["discriminators"];

  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinRelationFieldMetadata>(target, name, (field) => {
      field.reference = (row?: Record<string, unknown>) => {
        if (discriminatorKey && discriminators) {
          const key = row?.[discriminatorKey] as string;
          return discriminators[key] ?? input["fallbackValue"];
        }
        if (isFunction(input)) return (input as () => unknown)();
        return input;
      };

      field.type = CinFieldType.Relation;
      field.useDataRepository = useDataRepository;
      field.discriminatorKey = discriminatorKey;
    });
  };
}
