import {
  CinCrudModel,
  CinId,
  CinLabel,
  CinModel,
  CinReadOnly,
  CinSearchable,
  CinSortable,
  CinText,
} from "cints-core";
import { InMemoryRepository } from "../repositories/in-memory.repository";

export const companyRepository = new InMemoryRepository([
  { id: 1, name: "Acme" },
  { id: 2, name: "Globex" },
]);

@CinCrudModel({
  // `name` and `path` are set explicitly: the defaults come from the class
  // name, which a minifier may rename in a production build.
  name: "Company",
  path: "companies",
  dataRepository: companyRepository,
  createOptions: { enable: true },
  updateOptions: { enable: true },
  deleteOptions: { enable: false },
  viewPageOptions: { enable: true },
  actionOptions: { flatRowAction: true, showActions: true },
})
export class Company extends CinModel {
  @CinReadOnly()
  @CinId()
  id!: number;

  // `@CinLabel` marks the field that represents a company where another
  // model refers to it.
  @CinLabel()
  @CinSearchable()
  @CinSortable()
  @CinText()
  name!: string;
}
