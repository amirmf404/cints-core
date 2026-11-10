import { CinFieldMetadata } from "./cin-field-metadata.interface";

export interface ICinSection {
  label: string;
  fields: {
    label: string;
    field: CinFieldMetadata[];
  };
}
