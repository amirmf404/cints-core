# Cints Documentation

This repo hosts the two packages that work together to ship metadata-driven CRUD admin UIs.

- `cints-core`: Decorator-first metadata toolkit. Describe models once (fields, validation, actions, visibility, layout hints) and retrieve the resulting `CinCrudModelMetadata` via `getMetaData()`.
- `cinvue`: Vue 3 + PrimeVue component library that consumes that metadata to render forms, tables, and ready-made CRUD pages.

## Contents

- [`cints-core` reference](./cints-core.md): Installation, model lifecycle, full decorator/API catalog with examples, enums, and repository contract.
- [`cinvue` guide](./cinvue.md): Plugin setup, components, router builder, page props, and how `CinCrudModelMetadata` maps to the rendered UI.

## Quick workflow (both packages together)

1. Model your entities in `cints-core`:

```ts
import "reflect-metadata";
import { CinCrudModel, CinModel, CinId, CinText } from "cints-core";

@CinCrudModel({ path: "users", dataRepository: userRepo })
class User extends CinModel {
  @CinId() id!: number;
  @CinText() name!: string;
}
```

2. Render the admin UI with CinVue:

```ts
import { CinVuePlugin, CinRouterBuilder } from "cinvue";

const router = createRouter({
  history: createWebHistory(),
  routes: CinRouterBuilder({ routesItem: [User] }),
});

createApp(App).use(CinVuePlugin, { primeVue: PrimeVue, appRouter: router, pageLayout: Layout }).mount("#app");
```

CinVue will surface list/view pages for `User`, backed by `userRepo`. Customizations defined on the model (fields, tabs/sections, actions, validation) flow directly into the UI. Repeat for additional models to grow the admin panel consistently.

# cints-core

Decorator-first metadata toolkit for describing CRUD models, forms, tables, and actions. Models carry all UI hints in their class decorators and expose them through `getMetaData()`.

- Depends on `reflect-metadata`; import it once at app startup.
- Every model should extend `CinModel` and be decorated with `@CinCrudModel`.
- Metadata is stored on the class (static). `CinModel.getMetaData()` returns a `CinCrudModelMetadata` snapshot.

## Quick start

```ts
import "reflect-metadata";
import {
  CinCrudModel,
  CinModel,
  CinId,
  CinText,
  CinNumber,
  CinRelation,
  CinSearchable,
  CinFilterable,
  CinAction,
  CinExpose,
  CinValidation,
  CrudActionsEnum,
} from "cints-core";

@CinCrudModel({
  path: "users",
  dataRepository: userRepository, // implements CrudDataRepository
  actionOptions: { flatRowAction: false, showActions: true },
})
class User extends CinModel {
  @CinId() id!: number;

  @CinText() @CinSearchable() name!: string;

  @CinNumber() @CinFilterable() age!: number;

  @CinRelation(() => Company) company!: Company;

  @CinValidation({ [CrudActionsEnum.Create]: userCreateSchema })
  @CinExpose([{ action: CrudActionsEnum.Create }])
  @CinText()
  email!: string;

  @CinAction({ icon: "refresh", label: "Resync" })
  static resync(row: User) {
    return syncUser(row.id);
  }
}

// Later
const metadata = User.getMetaData();
```

## Model decorator: `@CinCrudModel(options)`

- `name` defaults to the class name without a trailing `Model`; `path` defaults to kebab-case of the name.
- Page options: `createOptions`, `updateOptions`, `deleteOptions`, `viewPageOptions`, `indexPageOptions` (grid/table modes, export options, pagination limits, toggle-mode visibility).
- Data: `dataRepository` implements `CrudDataRepository` (`create`, `update`, `findPaginate`, `findById`, `delete`). The decorator wraps these methods to honor `CinDataPath` mappings on fields (filters/search/sort and payloads are rewritten).
- Layout/behavior: `actionOptions` (row action layout, visibility), `copyOptions`, `selectedTable`, `children` (nested models), `export` (enable/path), `icon`, `colorHandler` (row color function).
- Helpers on the class: `CinModel.getMetaData()` returns metadata; `CinModel.overrideMetaData(partial)` clones the class with merged metadata and bumps an internal version.

## Field basics

Decorate class properties to describe the UI and behavior of each field.

- Identity & labeling: `CinId()`, `CinField({ label })`, `CinLabel({ priority, label })` (marks fields that identify a row).
- Visibility: `CinExpose([actions])`, `CinExclude([actions])`, `CinReadOnly()` (exposed on view/index only).
- Interactions: `CinSortable()`, `CinSearchable()`, `CinFilterable(targetField?)`, `CinCopyable()`, `CinArray()`, `CinVirtualField()`.
- Layout hints: `CinTab({ label, priority })`, `CinSection({ label, priority })`, `CinTabView({ label, priority, model })`.
- Customization: `CinCustomFieldComponent({ component, props })`, `CinColor(handler)` on a field sets a color handler; `CinPresets(data|fn)` supplies preset values; `CinDataPath(path)` maps the field to a nested key in API payloads.
- Validation & translation: `CinValidation(schema)` accepts a Yup schema or action-specific schemas; `CinExposeTranslate()` / `CinExcludeTranslate()` toggle translation per `CinTranslateEnum`.

## Field types

Use one of the type decorators; each sets `type` and accepts per-type options.

- Primitives: `CinText`, `CinLongText({ parser })`, `CinNumber`, `CinBoolean`, `CinCurrency`, `CinEmail`, `CinPassword`, `CinPhoneNumber`, `CinJson`.
- Structured: `CinEnum(enumObj, severity?)`, `CinDate({ dateOptions })`, `CinFile({ fileType, maxFileSize, run, defaultValue })`.
- Relations & nested models: `CinRelation(model | discriminatorConfig | () => model, useDataRepository?)` for references; `CinObject({ model, tableMode })` for embedded objects; `CinCustomType()` for ad-hoc renderers.

Each decorator also stamps the field name/label if not already set.

## Actions

- `@CinAction({ icon, label, run? })` can be placed on:
  - A static method: creates a row action; `run` calls the method with passed args.
  - The class: creates a model action; `run` comes from the decorator `run` option.
- Actions are grouped by `CinActionTypeEnum.rowActions` and `modelActions` in metadata.

## Custom components and colors

- `CinCustomComponent({ component, props })` replaces the default view/form shell for the model.
- `CinCustomFieldComponent({ component, props })` overrides rendering for a single field (or all fields when placed on the class).
- `CinColor(handler?)` on a method sets a row-level color handler; on a field it requires a handler argument.

## Export, copy, and translate

- `CinExport({ enable, path })` toggles export on the model.
- `CinCopyable()` on the model enables copy for the whole entity; on a field it allows copying that value; `copyOptions` can provide custom serializer/deserializer.
- Translation flags live on `field.translate` keyed by `CinTranslateEnum`.

## Data path & repository behavior

- `CinDataPath("nested.key")` maps a field to a nested payload key. The model decorator rewrites:
  - `create`/`update` payloads: class properties move to the configured paths before repository calls.
  - `findById`/`findPaginate` responses: nested values are lifted back onto the class fields.
  - `filter`/`search`/`sortBy` options: field names are remapped to their data paths.

## Utilities and types

- Enums: `CinFieldType`, `CrudActionsEnum`, `CinFileType`, `CinDateStructure`, `CinEditorParser`, `FilterOperation`, `ExportMode`, `ExportType`, `IndexPageMode`, `LoadMoreMode`, `SeverityTypeEnum`, `CinTranslateEnum`.
- Interfaces: `CinCrudModelMetadata`, `CinFieldMetadata` (and subtypes), `CrudDataRepository`, `PaginationOptions`, `IndexPageOptions`, `CinCustomComponentInterface`, `CinActionInterface`, `CopyOptions`, `LabelOptions`.

## Example metadata output

```ts
const meta = User.getMetaData();
// meta.modelName -> "User"
// meta.path -> "users"
// meta.fields.email.searchable -> true
// meta.actions.rowActions[0].label -> "Resync"
```

# cints-core | Optional model icon. |

| `dataRepository` | `CrudDataRepository` | | Custom serializer/deserializer for copy. |
| `indexPageOptions` | `IndexPageOptions` | | Enables multi-select mode in CinVue tables. |
| `children` | `CinModel[]` | s metadata. | `@CinTabView({ priority: 2, label: "Orders", model: Order }) orders` |
| `@CinCustomComponent({ component, props })` | Model-level override for index/create/view shells. | `@CinCustomComponent({ component: CustomPage })` |
| `@CinCustomFieldComponent({ component, props })` | Field or model-level override for input/view renderer. | `@CinCustomFieldComponent({ component: MyInput, props: { dense: true } })` |

### Validation: `@CinValidation(schema)`

Attach Yup schema (single schema or per-action object with `create`/`update` keys). Evaluated before submission.

```ts
@CinValidation(userSchema) email: string;
@CinValidation({ [CrudActionsEnum.Create]: createSchema, [CrudActionsEnum.Update]: updateSchema }) age: number;
```

## Field type decorators

Each sets `type` and optional defaults.

| Decorator                                                  | Options                                                        | Default                                   | Notes                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | --- | -------------------------------- |
| `@CinId({ showOnIndex? })`                                 | `showOnIndex` unused flag                                      |                                           | Numeric field.                              |
| `@CinBoolean({ defaultValue? })`                           | `boolean`                                                      |                                           | Currency value.                             |
| `@CinEmail({ defaultValue? })`                             | `boolean` (metadata holds value)                               |                                           | Password input.                             |
| `@CinPhoneNumber({ defaultValue? })`                       | `number`                                                       |                                           | JSON editor/viewer.                         |
| `@CinEnum(enumObj, severity?, { defaultValue? })`          | `severity: SeverityTypeEnum`                                   | `SeverityTypeEnum.null`                   | Enum select with optional severity styling. |
| `@CinDate({ defaultValue?, dateOptions })`                 | `dateOptions: CinDateStructure`                                | `CinDateStructure.Date`                   | Date/time picker formats.                   |
| `@CinFile({ defaultValue?, fileType, maxFileSize, run? })` | `fileType: CinFileType`, `maxFileSize: number`, optional `run` | `fileType: ALL`, `maxFileSize: 1_000_000` | File upload handler.                        |
| `@CinRelation(model                                        | discriminatorConfig                                            | () => model, useDataRepository?)`         | See below                                   |     | Embedded object/array rendering. |
| `@CinCustomType()`                                         |                                                                | Mark field for custom renderer.           |

**CinRelation discriminator config**:

```ts
@CinRelation({
 discriminatorKey: "type",
 fallbackValue: Guest,
 discriminators: { admin: AdminModel, staff: StaffModel },
})
role;
```

## Enums quick reference

- `CrudActionsEnum`: `create`, `update`, `view`, `index`, `delete`
- `CinFieldType`: `Boolean`, `Number`, `Currency`, `Text`, `LongText`, `File`, `Identifier`, `PhoneNumber`, `Enum`, `Date`, `Password`, `Json`, `Array`, `Relation`, `Object`, `Email`, `custom`
- `CinEditorParser`: `RAW`, `JSON`, `HTML`
- `CinDateStructure`: `DateTimeFa`, `DateTime`, `DateFa`, `Date`
- `CinFileType`: `ALL`, `IMAGE`, `VIDEO`, `AUDIO` (plus any values defined in enum)
- `SeverityTypeEnum`: `success`, `info`, `warning`, `danger`, `null`
- `IndexPageMode`: `Grid`, `Table`
- `LoadMoreMode`: `INFINITY_SCROLL`, `PAGINATION`
- `ExportMode`: `Local`, `Server`
- `ExportType`: `PDF`, `CSV`, `EXCEL`
- `FilterOperation`: `IN`, `NOT_IN`, `BETWEEN`, `NOT_BETWEEN`, `EQ`, `GT`, `GTE`, `LT`, `LTE`, `NE`, `LIKE`, `ILIKE`, `IREGEXP`, `NOT_ILIKE`, `NOT_IREGEXP`, `NOT_LIKE`, `REGEXP`, `NOT_REGEXP`, `IS`, `NOT`, `ELM_MTC`

## Putting it together (comprehensive example)

```ts
import "reflect-metadata";
import {
  CinCrudModel,
  CinModel,
  CinId,
  CinText,
  CinEnum,
  CinBoolean,
  CinDate,
  CinRelation,
  CinExpose,
  CinExclude,
  CinSearchable,
  CinFilterable,
  CinSortable,
  CinValidation,
  CinDataPath,
  CinTab,
  CinSection,
  CinAction,
  CinColor,
  CinPresets,
  CrudActionsEnum,
  CinDateStructure,
  CinFile,
  CinFileType,
} from "cints-core";

enum Status {
  Active = "active",
  Suspended = "suspended",
}

@CinCrudModel({
  path: "users",
  dataRepository: userRepo, // implements CrudDataRepository
  indexPageOptions: {
    mode: IndexPageMode.Table,
    loadMoreMode: LoadMoreMode.PAGINATION,
    limitOptions: { enabled: true, default: 20 },
    exportOptions: { enabled: true, mode: ExportMode.Server, type: [ExportType.CSV, ExportType.EXCEL] },
  },
  actionOptions: { flatRowAction: false, showActions: true },
})
export class User extends CinModel {
  @CinId() id!: number;

  @CinField({ label: "Full Name" })
  @CinSearchable()
  @CinSortable()
  @CinTab({ priority: 0, label: "Profile" })
  @CinSection({ priority: 0, label: "Basics" })
  name!: string;

  @CinEnum(Status, undefined, { defaultValue: Status.Active })
  @CinFilterable()
  @CinPresets({ Active: Status.Active, Suspended: Status.Suspended })
  status!: Status;

  @CinDate({ dateOptions: CinDateStructure.Date })
  @CinFilterable()
  @CinSortable()
  joinedAt!: string;

  @CinRelation(() => Company, true)
  @CinDataPath("company.id")
  company!: Company;

  @CinFile({ fileType: CinFileType.IMAGE, maxFileSize: 2_000_000 })
  avatar!: File;

  @CinBoolean()
  @CinExpose([{ action: CrudActionsEnum.View }, { action: CrudActionsEnum.Index }])
  @CinExclude([{ action: CrudActionsEnum.Create }]) // hidden on create
  verified!: boolean;

  @CinValidation({
    [CrudActionsEnum.Create]: createUserSchema,
    [CrudActionsEnum.Update]: updateUserSchema,
  })
  email!: string;

  @CinAction({ icon: "pi pi-sync", label: "Sync" })
  static resync(row: User) {
    return syncUser(row.id);
  }

  @CinColor((user) => (user.status === Status.Suspended ? "red" : undefined))
  statusColor!: string;
}
```

Read the metadata anywhere:

```ts
const meta = User.getMetaData();
console.log(meta.fields.email.validation); // yup schemas
console.log(meta.actions.rowActions); // [{ label: "Sync", ... }]
```
