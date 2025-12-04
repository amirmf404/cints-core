import { setCinDefaultNameField, getCinFieldObject, getCinMetaData, setCinMetaData } from "../../utils/utils";
import { set } from "lodash";
import { CinFieldType } from "../../enum/cin-field-type.enum";
import { CinDateStructure } from "../../enum/cin-date-structure.enum";
import { CinDateFieldMetadata } from "../../interface/cin-field-metadata.interface";

export function CinDate({ defaultValue, dateOptions }: { defaultValue?: Date, dateOptions: CinDateStructure } = { dateOptions: CinDateStructure.Date }) {
  return (target: {} | any, name: PropertyKey): any => {
    let object = getCinMetaData(target.constructor) ?? {};
    let fieldObject = getCinFieldObject<CinDateFieldMetadata>(object, name);

    fieldObject.type = CinFieldType.Date;
    fieldObject.defaultValue = defaultValue;
    fieldObject.dateOptions = dateOptions

    set(object, `fields.${name.toString()}`, fieldObject);
    setCinMetaData(object, target.constructor);
    setCinDefaultNameField(object, name)
  };
}
