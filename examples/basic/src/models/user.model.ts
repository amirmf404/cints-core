import {
  CinAction,
  CinArray,
  CinBoolean,
  CinColor,
  CinCopyable,
  CinCrudModel,
  CinCurrency,
  CinDataPath,
  CinDate,
  CinDateStructure,
  CinEditorParser,
  CinEmail,
  CinEnum,
  CinExclude,
  CinExport,
  CinExpose,
  CinField,
  CinFilterable,
  CinId,
  CinLabel,
  CinLongText,
  CinModel,
  CinObject,
  CinPassword,
  CinPresets,
  CinReadOnly,
  CinRelation,
  CinSearchable,
  CinSection,
  CinSortable,
  CinTab,
  CinText,
  CinValidation,
  CrudActionsEnum,
  ExportMode,
  ExportType,
  IndexPageMode,
  LoadMoreMode,
  SeverityTypeEnum,
} from "cints-core";
import { string } from "yup";
import { InMemoryRepository } from "../repositories/in-memory.repository";
import { Address } from "./address.model";
import { Company } from "./company.model";

export enum UserStatus {
  Active = "active",
  Suspended = "suspended",
}

/**
 * The rows as the "API" stores them. `fullName` and `email` live under
 * `profile`; the model below maps them with `@CinDataPath`.
 */
export const userRepository = new InMemoryRepository([
  {
    id: 1,
    profile: { fullName: "Ada Lovelace", email: "ada@example.com" },
    status: UserStatus.Active,
    balance: 1200,
    isAdmin: true,
    company: 1,
    address: { city: "London", street: "12 St James's Square", postalCode: "" },
    tags: ["math"],
  },
  {
    id: 2,
    profile: { fullName: "Grace Hopper", email: "grace@example.com" },
    status: UserStatus.Suspended,
    balance: 0,
    isAdmin: false,
    company: 2,
    address: { city: "New York", street: "1 Main Street", postalCode: "" },
    tags: [],
  },
]);

@CinExport({ path: "users/export" })
@CinCopyable()
@CinAction({
  // On the class: a model action, it is not tied to a row.
  name: "countUsers",
  icon: "pi pi-users",
  label: "Count users",
  run: () => userRepository.rows.length,
})
@CinCrudModel({
  name: "User",
  path: "users",
  icon: "pi pi-user",
  dataRepository: userRepository,
  createOptions: { enable: true },
  updateOptions: { enable: true, getValue: true },
  deleteOptions: { enable: true },
  viewPageOptions: { enable: true },
  actionOptions: { flatRowAction: false, showActions: true },
  indexPageOptions: {
    mode: IndexPageMode.Table,
    loadMoreMode: LoadMoreMode.PAGINATION,
    limitOptions: { enabled: true, default: 10 },
    exportOptions: {
      enabled: true,
      mode: ExportMode.Local,
      type: [ExportType.CSV],
    },
    defaultSortBy: ["fullName"],
  },
})
export class User extends CinModel {
  @CinReadOnly()
  @CinId()
  id!: number;

  @CinValidation(string().required())
  @CinField({ label: "Full name" })
  @CinLabel()
  @CinSearchable()
  @CinSortable()
  @CinTab({ label: "Profile" })
  @CinSection({ label: "Identity" })
  @CinDataPath("profile.fullName")
  @CinText()
  fullName!: string;

  // A different schema for each form.
  @CinValidation({
    [CrudActionsEnum.Create]: string().email().required(),
    [CrudActionsEnum.Update]: string().email(),
  })
  @CinCopyable()
  @CinSearchable()
  @CinTab({ label: "Profile" })
  @CinSection({ label: "Identity" })
  @CinDataPath("profile.email")
  @CinEmail()
  email!: string;

  // Only part of the create form.
  @CinExpose([CrudActionsEnum.Create])
  @CinExclude([
    CrudActionsEnum.Update,
    CrudActionsEnum.View,
    CrudActionsEnum.Index,
  ])
  @CinPassword()
  password!: string;

  @CinColor((row) =>
    (row as User).status === UserStatus.Suspended ? "red" : "green"
  )
  @CinPresets({ Active: UserStatus.Active, Suspended: UserStatus.Suspended })
  @CinFilterable()
  @CinEnum(UserStatus, SeverityTypeEnum.info, {
    defaultValue: UserStatus.Active,
  })
  status!: UserStatus;

  @CinSortable()
  @CinCurrency({ defaultValue: 0 })
  balance!: number;

  @CinBoolean({ defaultValue: false })
  isAdmin!: boolean;

  @CinTab({ label: "Profile", priority: 0 })
  @CinSection({ label: "About", priority: 1 })
  @CinDate({ dateOptions: CinDateStructure.Date })
  birthDate?: string;

  @CinExclude([CrudActionsEnum.Index])
  @CinTab({ label: "Profile" })
  @CinSection({ label: "About", priority: 1 })
  @CinLongText({ parser: CinEditorParser.MARKDOWN })
  bio?: string;

  // The model is passed as a function, so it is only read when it is needed
  // and models can refer to each other.
  @CinFilterable()
  @CinTab({ label: "Organization", priority: 1 })
  @CinRelation(() => Company)
  company!: number;

  @CinExclude([CrudActionsEnum.Index])
  @CinTab({ label: "Organization", priority: 1 })
  @CinObject({ model: Address, tableMode: false })
  address!: Address;

  @CinArray()
  @CinText()
  tags!: string[];

  // On a static method: a row action. It is called with the row.
  @CinAction({ icon: "pi pi-ban", label: "Suspend" })
  static suspend(row: User) {
    return User.getMetaData().dataRepository!.update({
      id: row.id,
      entity: { status: UserStatus.Suspended },
    });
  }

  // On a static method: the color of the whole row.
  @CinColor()
  static rowColor(row: User) {
    return row.isAdmin ? "gold" : "white";
  }
}
