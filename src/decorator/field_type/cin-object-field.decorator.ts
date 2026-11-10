import { updateCinField } from "../../utils/utils";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinModel } from "../../model/cin-crud-model";
import { CinObjectFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinObject({
  model,
  tableMode = false,
}: {
  model: CinModel;
  tableMode?: boolean;
}) {
  return (target: {} | any, name: PropertyKey): void => {
    updateCinField<CinObjectFieldMetadata>(target, name, (field) => {
      field.reference = model;
      field.tableMode = tableMode;
      field.type = CinFieldType.Object;
    });
  };
}
