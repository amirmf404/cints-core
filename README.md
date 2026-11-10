# cints-core

Decorator-first metadata toolkit for describing CRUD models, forms, tables and actions.

You describe a model once, with decorators on a class: its fields, their types, validation, visibility, layout hints, actions and the repository that loads and saves it. `cints-core` turns that into one plain metadata object (`CinCrudModelMetadata`) that a UI layer can render. [`cinvue`](https://github.com/amirmf404/cinvue) is such a layer for Vue 3 and PrimeVue.

`cints-core` has no UI and no framework dependency. It runs in the browser and in Node.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [How metadata is built](#how-metadata-is-built)
- [Model decorator](#model-decorator-cincrudmodeloptions)
- [Field type decorators](#field-type-decorators)
- [Field option decorators](#field-option-decorators)
- [Visibility](#visibility)
- [Validation](#validation)
- [Actions](#actions)
- [Colors](#colors)
- [Custom components](#custom-components)
- [Data repository and data paths](#data-repository-and-data-paths)
- [`CinModel`](#cinmodel)
- [Enums](#enums)
- [Utilities](#utilities)
- [Example](#example)
- [Development](#development)

## Installation

```bash
npm install cints-core
```

The decorators are TypeScript (legacy) decorators. Enable them in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

`cints-core` loads `reflect-metadata` itself, you do not have to import it.

## Quick start

```ts
import {
  CinAction,
  CinCrudModel,
  CinEmail,
  CinFilterable,
  CinId,
  CinModel,
  CinNumber,
  CinReadOnly,
  CinSearchable,
  CinText,
} from "cints-core";

@CinCrudModel({
  name: "User",
  path: "users",
  dataRepository: userRepository, // implements CrudDataRepository
  createOptions: { enable: true },
  updateOptions: { enable: true },
  deleteOptions: { enable: true },
  viewPageOptions: { enable: true },
  actionOptions: { flatRowAction: false, showActions: true },
})
export class User extends CinModel {
  @CinReadOnly()
  @CinId()
  id!: number;

  @CinSearchable()
  @CinText()
  name!: string;

  @CinEmail()
  email!: string;

  @CinFilterable()
  @CinNumber({ defaultValue: 18 })
  age!: number;

  @CinAction({ icon: "pi pi-refresh", label: "Resync" })
  static resync(row: User) {
    return syncUser(row.id);
  }
}

const metadata = User.getMetaData();

metadata.modelName; // "User"
metadata.path; // "users"
metadata.fields.name.searchable; // true
metadata.fields.age.defaultValue; // 18
metadata.actions.rowActions[0].label; // "Resync"
```

A complete, runnable version is in [`example/`](./example).

## How metadata is built

- A model is a class that extends `CinModel` and has `@CinCrudModel`. Every decorator writes into one metadata object that is stored on the class. `Model.getMetaData()` returns it.
- **A field exists as soon as it has one decorator.** Every field decorator registers the field in `metadata.fields` and gives it a `name` and a `label` (both default to the property name). A property without any decorator is not part of the metadata.
- **Decorators can be written in any order.** The one exception is described under [Visibility](#visibility): when two decorators set the visibility of the same action, the one closest to the property wins.
- **Metadata is not inherited.** A subclass of a model starts with empty metadata, it does not get the fields of its parent. Give the subclass its own decorators, or use [`overrideMetaData`](#cinmodel) to derive a variant of a model.
- **Set `name` and `path` in production builds.** Their defaults come from the class name, and a minifier may rename classes.

## Model decorator: `@CinCrudModel(options)`

| Option             | Type                                              | Description                                                                                              |
| ------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `name`             | `string`                                          | Model name. Default: the class name without a trailing `Model` (`UserModel` → `User`).                   |
| `path`             | `string`                                          | Route or API path. Default: the name in kebab-case (`UserProfile` → `user-profile`).                     |
| `icon`             | `string`                                          | Icon of the model.                                                                                       |
| `dataRepository`   | `CrudDataRepository`                              | Loads and saves the entities. See [Data repository](#data-repository-and-data-paths).                    |
| `createOptions`    | `{ enable, customComponent?, createRoute?, fullScreen?, role? }` | Create form.                                                                              |
| `updateOptions`    | the same, plus `getValue?`                        | Update form. `getValue` asks the UI to load the entity with `findById` before editing.                   |
| `deleteOptions`    | `{ enable }`                                      | Delete action.                                                                                           |
| `viewPageOptions`  | `{ enable, customComponent? }`                    | View page.                                                                                               |
| `actionOptions`    | `{ flatRowAction, showActions }`                  | Whether row actions are shown, and whether they are shown flat or in a menu.                             |
| `indexPageOptions` | `IndexPageOptions`                                | List page: `mode`, `loadMoreMode`, `enableToggleMode`, `showIndex`, `limitOptions`, `exportOptions`, `defaultSortBy`. |
| `copyOptions`      | `CopyOptions`                                     | `enabled`, `serializer`, `deSerializer` for copying an entity.                                           |
| `labels`           | `LabelOptions[]`                                  | Labels of the model, placed before the ones added with `@CinLabel`.                                      |
| `selectedTable`    | `boolean`                                         | Whether rows of the list can be selected.                                                                |
| `children`         | `CinModel[]`                                      | Child models shown with an entity.                                                                       |

**Defaults.** The two ways of leaving options out behave differently:

- `@CinCrudModel()` without an argument enables everything: create, update, delete, view and row actions.
- `@CinCrudModel({ ... })` with an options object enables only what the object enables. A page that is left out is stored as `{ enable: false }`, and a missing `actionOptions` as `{ flatRowAction: false, showActions: false }`.

After `@CinCrudModel` has run, `fields`, `labels`, `actions`, `createOptions`, `updateOptions`, `deleteOptions`, `viewPageOptions` and `actionOptions` are always present in the metadata.

Other class decorators:

| Decorator                                        | Effect                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `@CinExport({ enable?, path? })`                 | Sets `metadata.export`. `enable` defaults to `true`.                                    |
| `@CinCopyable()`                                 | Sets `metadata.copyable`.                                                               |
| `@CinCustomComponent({ component, props? })`     | Sets `metadata.customComponent`, a replacement for the default view of the model.       |
| `@CinCustomFieldComponent({ component, props? })` | Sets `metadata.customComponentField`, the default field component of the model.        |
| `@CinExpose()`, `@CinExclude()`, `@CinReadOnly()` | Set the visibility of every field. See [Visibility](#visibility).                      |
| `@CinExposeTranslate()`, `@CinExcludeTranslate()` | Set the translate flag of every field.                                                 |
| `@CinAction({ ... })`                            | Adds a model action. See [Actions](#actions).                                           |

## Field type decorators

Each one sets `field.type`. Use one per field.

| Decorator                                              | `field.type`  | Options and what they set                                                                                                     |
| ------------------------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `@CinId()`                                             | `identifier`  |                                                                                                                               |
| `@CinText({ defaultValue? })`                          | `text`        | `defaultValue: string`                                                                                                        |
| `@CinLongText({ defaultValue?, parser? })`             | `longtext`    | `parser: CinEditorParser` → `field.textEditorParser`. Default `RAW`.                                                          |
| `@CinNumber({ defaultValue? })`                        | `number`      | `defaultValue: number`                                                                                                        |
| `@CinCurrency({ defaultValue? })`                      | `currency`    | `defaultValue: number \| string`                                                                                              |
| `@CinBoolean({ defaultValue? })`                       | `boolean`     | `defaultValue: boolean`                                                                                                       |
| `@CinEmail({ defaultValue? })`                         | `email`       | `defaultValue: string`                                                                                                        |
| `@CinPassword({ defaultValue? })`                      | `password`    | `defaultValue: string`                                                                                                        |
| `@CinPhoneNumber({ defaultValue? })`                   | `phonenumber` | `defaultValue: number \| string`                                                                                              |
| `@CinJson({ defaultValue? })`                          | `json`        | `defaultValue: string`                                                                                                        |
| `@CinDate({ defaultValue?, dateOptions? })`            | `date`        | `dateOptions: CinDateStructure` → `field.dateOptions`. Default `Date`.                                                        |
| `@CinEnum(enumObject, severity?, { defaultValue? })`   | `enum`        | `enumObject` → `field.enumOptions`. `severity: SeverityTypeEnum` → `field.Severity`. Default `SeverityTypeEnum.null`.         |
| `@CinFile({ defaultValue?, fileType?, maxFileSize?, run? })` | `file`  | `fileType: CinFileType` → `field.fileTypeMode` (default `ALL`). `maxFileSize` in bytes (default `1000000`). `run` is the upload handler. |
| `@CinRelation(model, useDataRepository?)`              | `relation`    | A reference to another model. See below.                                                                                      |
| `@CinObject({ model, tableMode? })`                    | `object`      | An embedded object described by `model` → `field.reference`. `tableMode` defaults to `false`.                                 |
| `@CinCustomType()`                                     | `custom`      | A field that is rendered by a custom component.                                                                               |

All `defaultValue` options set `field.defaultValue`.

### `@CinRelation`

The first argument is one of:

```ts
// A function that returns the model. Use this form: the model is only read
// when it is needed, so two models can refer to each other.
@CinRelation(() => Company)
company!: number;

// The model itself.
@CinRelation(Company)
company!: number;

// A model that depends on the row.
@CinRelation({
  discriminatorKey: "ownerType",
  discriminators: { user: User, company: Company },
  fallbackValue: User,
})
owner!: number;
```

`field.reference` is always a function: `field.reference(row)` returns the model. With a discriminator it returns `discriminators[row[discriminatorKey]]`, or `fallbackValue` when there is no match or no row. `field.discriminatorKey` holds the key.

`useDataRepository` is stored as `field.useDataRepository`, a flag for the UI layer. `cints-core` does not use it.

## Field option decorators

| Decorator                                  | Effect on the field                                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `@CinField({ label? })`                    | Registers the field. Sets `label` when it is given.                                                 |
| `@CinLabel({ priority?, label? })`         | Adds `{ priority, label }` to `metadata.labels`. `label` defaults to the property name. The labels tell the UI which fields represent an entity, for example where a relation points to it. |
| `@CinSortable()`                           | `sortable = true`                                                                                   |
| `@CinSearchable()`                         | `searchable = true`                                                                                 |
| `@CinFilterable(targetField?)`             | `filterable = true`, `targetField` is the field to filter on when it differs.                       |
| `@CinCopyable()`                           | `copyable = true`                                                                                   |
| `@CinArray()`                              | `isArray = true`: the field holds a list of values of its type.                                     |
| `@CinVirtualField()`                       | `virtual = true`: the field is not a stored property of the entity.                                 |
| `@CinTab({ label, priority? })`            | `tab = { label, priority }`. `priority` defaults to `0`.                                            |
| `@CinSection({ label, priority? })`        | `section = { label, priority }`                                                                     |
| `@CinTabView({ label, model, priority? })` | `tabView = { label, model, priority }`                                                              |
| `@CinPresets(data \| () => data)`          | `presets`: named preset values, for example quick filters.                                          |
| `@CinDataPath(path)`                       | `dataPath`: where the value lives in the API payload. See [Data paths](#data-repository-and-data-paths). |
| `@CinCustomFieldComponent({ component, props? })` | `customComponentField`: a component that renders this field.                                 |
| `@CinColor(handler)`                       | `colorHandler`. See [Colors](#colors).                                                              |
| `@CinValidation(schema)`                   | `validation`. See [Validation](#validation).                                                        |
| `@CinExposeTranslate()`, `@CinExcludeTranslate()` | `translate.enable = true` or `false`.                                                        |

## Visibility

`field.expose` says on which CRUD actions a field is shown. The actions are `CrudActionsEnum.Create`, `Update`, `View`, `Index` and `Delete`.

| Decorator               | Effect                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `@CinExpose(actions?)`  | Marks the field as shown on the given actions. Without an argument: on all actions.    |
| `@CinExclude(actions?)` | Marks the field as hidden on the given actions. Without an argument: on all actions.   |
| `@CinReadOnly()`        | Hidden on create and update, shown on view and index.                                  |

An item of `actions` is an action, or an action with a condition on the form value:

```ts
@CinExclude([CrudActionsEnum.Index])
@CinExpose([
  { action: CrudActionsEnum.Update, condition: (form) => form.isAdmin === true },
])
@CinText()
secretNote!: string;

metadata.fields.secretNote.expose;
// {
//   index:  { expose: false, condition: undefined },
//   update: { expose: true,  condition: [Function] },
// }
```

Rules:

- An action that no decorator mentions has no entry in `field.expose`. A UI should treat a missing entry as "shown".
- The first value set for an action is kept. Decorators are applied from the one closest to the property upwards, so when two decorators name the same action, the lower one wins.
- On a class, the three decorators apply to every field, without replacing what a field has set itself.

The translate decorators follow the same rules for `field.translate`.

## Validation

`@CinValidation` stores a schema on `field.validation`. `cints-core` does not run it, the UI does. Pass one schema for both forms, or one per form:

```ts
import { string } from "yup";

@CinValidation(string().required())
@CinText()
name!: string;

@CinValidation({
  [CrudActionsEnum.Create]: string().email().required(),
  [CrudActionsEnum.Update]: string().email(),
})
@CinEmail()
email!: string;
```

## Actions

`@CinAction({ icon, label?, name?, run? })` adds an action to `metadata.actions`.

```ts
// On the class: a model action. `run` is required to make it do something.
@CinAction({
  name: "import",
  icon: "pi pi-upload",
  label: "Import",
  run: () => importUsers(),
})
@CinCrudModel()
export class User extends CinModel {
  // On a static method: a row action. The method is called with the
  // arguments the UI passes, usually the row.
  @CinAction({ icon: "pi pi-ban", label: "Suspend" })
  static suspend(row: User) {
    return suspendUser(row.id);
  }
}

const { rowActions, modelActions } = User.getMetaData().actions;
rowActions[0].run(row); // calls User.suspend(row)
modelActions[0].run(); // calls the run option
```

- Each action is stored as `{ name, icon, label, run, DataRepository }`. `name` is the method name for a row action. `DataRepository` is the model class.
- Inside `run` and inside the static method, `this` is the model class.
- The decorator throws when it is used on an instance method.

## Colors

`@CinColor` has two uses:

```ts
export class User extends CinModel {
  // On a field: the handler is required. Sets field.colorHandler.
  @CinColor((row) => (row.status === "suspended" ? "red" : "green"))
  @CinText()
  status!: string;

  // On a method: no argument. The method becomes metadata.colorHandler,
  // the color of the whole row.
  @CinColor()
  static rowColor(row: User) {
    return row.isAdmin ? "gold" : "white";
  }
}
```

A handler receives the row and returns a `Color`: a named color, `#hex`, `rgb(...)` or `rgba(...)`. The decorator throws when a field has no handler, or a method has one.

## Custom components

`CinCustomComponentInterface` is `{ component, props? }`. `cints-core` only stores it, so `component` can be anything the UI layer understands.

- `@CinCustomComponent(...)` on the class sets `metadata.customComponent`.
- `@CinCustomFieldComponent(...)` on a field sets `field.customComponentField`, on the class it sets `metadata.customComponentField`.
- `createOptions`, `updateOptions` and `viewPageOptions` each accept a `customComponent`. For the forms, `role` (`cinCustomComponentRoleEnum.MODAL` or `FORM`) says how the component is used.

## Data repository and data paths

A repository implements `CrudDataRepository`:

```ts
interface CrudDataRepository<T> {
  create({ entity, parent? }): any;
  findById({ id, parent? }): any;
  findPaginate(options: PaginationOptions): Promise<Pagination<T>>;
  update({ id, entity, parent? }): any;
  delete({ id, parent? }): any;
}

interface PaginationOptions {
  id?: string | number;
  sortBy?: string[]; // "name" ascending, "-name" descending
  limit?: number;
  page?: number;
  filter?: FilterOption[]; // { field, operation: FilterOperation, value }
  search?: FilterOption[];
  parent?: Record<any, any>;
}

interface Pagination<T> extends PaginationOptions {
  items: T[];
  itemCount: number;
  pageCount?: number;
}
```

`parent` is the parent entity when the model is used as a child of another model.

### Data paths

`@CinDataPath` maps a field to a nested key of the API payload:

```ts
@CinDataPath("profile.fullName")
@CinText()
fullName!: string;
```

Always call the repository through the metadata. `metadata.dataRepository` is a wrapper around the repository you passed, and it applies the mappings in both directions:

| Call                 | What the wrapper does                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `create`, `update`   | Sends `{ profile: { fullName } }` instead of `{ fullName }`. Maps the response back.           |
| `findById`           | Maps the response back: `{ profile: { fullName } }` becomes `{ fullName }`.                    |
| `findPaginate`       | Rewrites the field names in `filter`, `search` and `sortBy`. Maps every item of the response back. |
| `delete`             | Passed through.                                                                                |

```ts
const repository = User.getMetaData().dataRepository;

await repository.create({ entity: { fullName: "Ada" } });
// your repository receives { entity: { profile: { fullName: "Ada" } } }
// and the result is again { id: 1, fullName: "Ada" }

await repository.findPaginate({ sortBy: ["-fullName"] });
// your repository receives { sortBy: ["-profile.fullName"] }
```

Details:

- The repository you passed is not changed. Calling it directly skips the mappings.
- The entity you pass to `create` or `update` is not changed either, the wrapper sends a copy.
- `update` passes `id` on. When `id` is missing, it uses `entity.id`.
- All other parameters, such as `parent`, are passed on unchanged.
- The wrapped methods are `async`, whatever the originals return.
- Your methods are called with your repository as `this`.

## `CinModel`

| Static method               | Description                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `getMetaData()`             | Returns the `CinCrudModelMetadata` of the class, or `undefined` when the class has no decorators.           |
| `overrideMetaData(partial)` | Returns a new subclass whose metadata is a deep copy of the metadata of this class with the top-level keys of `partial` replaced. The class itself is not changed. With `null` or `undefined` it returns the class itself. |

```ts
const ReadOnlyUser = User.overrideMetaData({
  path: "read-only-users",
  createOptions: { enable: false },
  updateOptions: { enable: false },
  deleteOptions: { enable: false },
});

ReadOnlyUser.getMetaData().path; // "read-only-users"
User.getMetaData().path; // "users"
```

## Enums

| Enum                         | Members                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `CrudActionsEnum`            | `Create`, `Update`, `View`, `Index`, `Delete`                                                        |
| `CinFieldType`               | `Boolean`, `Number`, `Currency`, `Text`, `LongText`, `File`, `Identifier`, `PhoneNumber`, `Enum`, `Date`, `Password`, `Json`, `Array`, `Relation`, `Object`, `Email`, `custom` |
| `CinEditorParser`            | `RAW`, `HTML`, `MARKDOWN`                                                                            |
| `CinDateStructure`           | `Date` (`YYYY/MM/DD`), `DateTime` (`YYYY/M/D HH:mm:ss`), `DateFa` (`jYYYY/jMM/jDD`), `DateTimeFa` (`jYYYY/jMM/jDD HH:mm:ss`) |
| `CinFileType`                | `ALL`, `IMAGE`, `VIDEO`, `PDF`, `TXT`, `EXCEL`                                                       |
| `SeverityTypeEnum`           | `success`, `info`, `warning`, `danger`, `null` (the string `"null"`: no severity)                    |
| `CinActionTypeEnum`          | `rowActions`, `modelActions`                                                                         |
| `CinTranslateEnum`           | `Enable`                                                                                             |
| `cinCustomComponentRoleEnum` | `MODAL`, `FORM`                                                                                      |
| `IndexPageMode`              | `Grid`, `Table`                                                                                      |
| `LoadMoreMode`               | `INFINITY_SCROLL`, `PAGINATION`                                                                      |
| `ExportMode`                 | `Local`, `Server`                                                                                    |
| `ExportType`                 | `PDF`, `CSV`, `EXCEL`                                                                                |
| `FilterOperation`            | `IN`, `NOT_IN`, `BETWEEN`, `NOT_BETWEEN`, `EQ`, `GT`, `GTE`, `LT`, `LTE`, `NE`, `LIKE`, `ILIKE`, `IREGEXP`, `NOT_ILIKE`, `NOT_IREGEXP`, `NOT_LIKE`, `REGEXP`, `NOT_REGEXP`, `IS`, `NOT`, `ELM_MTC` |
| `CinCrudValidation`          | `STRING`, `NUMBER`, `EMAIL`, `DATE`, `REQUIRED`, `INT`                                               |

## Utilities

These are exported for UI layers and for writing your own decorators.

| Function                                  | Description                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `getCinMetaData(model)`                   | The metadata of a class, the same as `model.getMetaData()`.                                         |
| `setCinMetaData(metadata, model)`         | Stores a metadata object on a class.                                                                |
| `updateCinMetaData(target, update)`       | Loads the metadata of the class that owns a decorator target, calls `update(metadata)`, stores it.  |
| `updateCinField(target, name, update)`    | Registers the field and calls `update(field, metadata)`.                                            |
| `applyDecorators(...decorators)`          | Combines decorators into one.                                                                       |
| `setExpose(...)`, `setTranslate(...)`     | The building blocks of the visibility and translate decorators.                                     |
| `isClass(value)`, `isFunction(value)`     | Tell a class from a plain function, for example to resolve `() => Model`.                           |
| `extractModelName(name)`, `pathNormalizer(name)` | The defaults of `name` and `path`.                                                           |

A custom field decorator:

```ts
import { updateCinField } from "cints-core";

export function Placeholder(text: string) {
  return (target: object, name: string | symbol) => {
    updateCinField(target, name, (field) => {
      field.customComponentField = { component: "input", props: { placeholder: text } };
    });
  };
}
```

## Example

[`example/`](./example) is a small Vite app with three models and an in-memory repository. It shows the metadata of each model and runs every repository call through it.

```bash
npm install && npm run build   # build cints-core
cd example
npm install
npm run dev
```

## Development

```bash
npm install
npm run build   # writes dist/ (JavaScript) and dist/index.d.ts (types)
```

Changes are listed in [`change-log.md`](./change-log.md).
