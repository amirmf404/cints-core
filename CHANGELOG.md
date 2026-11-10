# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Forked from `cints-core` 0.0.4 as `metacrud`. The git history of `cints-core` is kept.
- The repository is a pnpm workspace. The library moved from the root to `packages/core`, and the example from `example` to `examples/basic`.
- `change-log.md` is now `CHANGELOG.md`, and `docs/design.puml` is `packages/core/design.puml`.
- The library package is named `@metacrud/core` (was `cints-core`) and starts at version 0.1.0. It is marked `private` until the first release, so it cannot be published by accident. The exported API (`Cin*`) is unchanged.
- The API reference moved from the root `README.md` to `packages/core/README.md`.
- The example is named `metacrud-example-basic` and uses `@metacrud/core` through the workspace (`workspace:*`) instead of `file:..`.

### Added

- `pnpm-lock.yaml`, and the list of dependencies that may run install scripts (`@swc/core`, `esbuild`) in `pnpm-workspace.yaml`.
- `typecheck` script in `@metacrud/core`.
- Vitest in `@metacrud/core`, with a first test file (`test/smoke.test.ts`) for model metadata and the data path mapping of the repository.
- Root scripts that run over all packages: `build`, `clean`, `typecheck`, `test`, `format` and `format:check` (Prettier).
- `.editorconfig` and `.prettierignore`.

### Fixed

- The build of `@metacrud/core` compiles its types from `tsconfig.build.json`, which only includes `src`. Test files do not end up in the type build.

### Removed

- The npm lockfiles (`package-lock.json`). The workspace uses pnpm.

## History of `cints-core`

The entries below were written for `cints-core`, before the fork.

## `v[0.0.4] - (2026-11-10)`

Entries below this one use the version numbers of the package before it was renamed.

### fixed

- v-0.0.4 build: the bundled `dist/index.d.ts` imported from `src/...` paths that do not exist in the package, so those types were lost for consumers. All imports in `src` are relative now
- v-0.0.4 build: the package could not be imported in Node. The compiled files now use full import paths (`./decorator/index.js`), and `lodash` is imported through its default export
- v-0.0.4 build: the type declarations were written to `dist/types`, the same folder as the compiled `src/types`. They are written to `dist/dts` and removed after bundling
- v-0.0.4 `package.json`: the `dev` script ran `clean` in the background (`&`) instead of before the watchers (`&&`)
- v-0.0.4 `utils.ts`: metadata is read with `Reflect.getOwnMetadata`. A subclass with the same name as its parent no longer changes the metadata of the parent
- v-0.0.4 `utils.ts`: `setCinDefaultNameField` replaced a label that was already set, so `@CinField({ label })` was lost when it was written below a type decorator. Existing names and labels are kept
- v-0.0.4 all field decorators: a field decorator on a static property stored its metadata on `Function`. The owner class is resolved correctly
- v-0.0.4 all field decorators: every field decorator registers the field with a name and a label. Before, a field that only had `@CinSortable`, `@CinSearchable`, `@CinFilterable`, `@CinTab`, `@CinSection`, `@CinTabView`, `@CinArray`, `@CinPresets`, `@CinCopyable` or `@CinColor` had no name
- v-0.0.4 `cin-set-expose.utils.ts`, `cin-set-translate.utils.ts`, `cin-validation.decorator.ts`: `@CinExpose`, `@CinExclude`, `@CinReadOnly`, `@CinExposeTranslate`, `@CinExcludeTranslate` and `@CinValidation` were ignored when they were the first decorator applied to a field (written closest to the property, or alone)
- v-0.0.4 `cin-label.decorator.ts`: `@CinLabel` threw when it was the first decorator applied in a class
- v-0.0.4 `cin-virtual-field.decorator.ts`: `@CinVirtualField` threw a `TypeError` when the class was defined. It now sets `virtual: true` on the field
- v-0.0.4 `cin-export.decorator.ts`: `@CinExport({ path })` left `enable` undefined. `enable` defaults to `true`
- v-0.0.4 `cin-color-decorator.ts`: `@CinColor()` on a static method stored the row color handler on `Function` instead of the model
- v-0.0.4 `cin-action.decorator.ts`: a class action without `run` got a `run` that threw. `run` is left undefined. The `name` option of a class action is stored
- v-0.0.4 `cin-relation.decorator.ts`: `field.reference()` threw when it was called without a row on a relation with a discriminator. It returns `fallbackValue`
- v-0.0.4 `cin-relation.decorator.ts`: `discriminators` was typed as an array, it is a map from value to model
- v-0.0.4 `cin-apply-decorators.utils.ts`: `applyDecorators` called property decorators as class decorators on static properties
- v-0.0.4 `Identify.type.ts`: `isClass` did not recognize a minified anonymous class (`class{}`)
- v-0.0.4 `cin-crud-model.ts`: `overrideMetaData` stored `undefined` when the class had no metadata
- v-0.0.4 `model.decorator.ts`: the `icon` and `labels` options were ignored
- v-0.0.4 `model.decorator.ts`: with an options object, pages that were left out were `undefined`, although the metadata type says they are always present. They are stored as `{ enable: false }`, and a missing `actionOptions` as `{ flatRowAction: false, showActions: false }`. `fields`, `labels` and `actions` are always present as well
- v-0.0.4 `model.decorator.ts`: repository calls threw on a model without fields
- v-0.0.4 `model.decorator.ts` dataRepository: `create` and `update` did not pass `parent` on
- v-0.0.4 `model.decorator.ts` dataRepository: `update` ignored the `id` parameter and always sent `entity.id`. `id` is used, with `entity.id` as fallback
- v-0.0.4 `model.decorator.ts` dataRepository: `create` and `update` changed the entity they were given. They send a copy
- v-0.0.4 `model.decorator.ts` dataRepository: a value of `0`, `false` or `""` at a data path was not mapped back to its field
- v-0.0.4 `model.decorator.ts` dataRepository: when a data path started with the name of its field (`company` → `company.id`), mapping the response back deleted a property of the value
- v-0.0.4 `model.decorator.ts` dataRepository: `findPaginate` threw when the response had no `items`
- v-0.0.4 `SeverityType.enum.ts`: `SeverityTypeEnum.null` was declared as `null` but was the string `"null"` at run time. The declaration says `"null"` now, the run-time value is the same
- v-0.0.4 field types: `defaultValue` of `@CinEmail` was typed `boolean`, of `@CinEnum` an object. `@CinCurrency` and `@CinPhoneNumber` accept `number | string`
- v-0.0.4 `cin-custom-component.decorator.ts`: the decorator was typed for a plain function, so TypeScript rejected it on a class
- v-0.0.4 `pagination-options.interface.ts`: removed an unused import from `child_process`

### changed

- v-0.0.4 `model.decorator.ts`: `metadata.dataRepository` is a wrapper that delegates to the repository given in the options. The given repository is no longer modified, so calling it directly does not apply the `@CinDataPath` mappings, and one repository can be used by several models
- v-0.0.4 `model.decorator.ts` dataRepository: an object that is left empty after its values are mapped back to their fields is removed from the response
- v-0.0.4 `cin-field.decorator.ts`: `@CinField()` without a label keeps a label that is already set
- v-0.0.4 `@CinDate`, `@CinFile`, `@CinLongText`, `@CinObject`, `@CinTab`, `@CinSection`, `@CinTabView`: options that have a default are optional, and the default also applies when other options are passed
- v-0.0.4 `cin-field-metadata.interface.ts`: `CinFieldMetadata` includes the enum and date field types. `run` of a file field is optional
- v-0.0.4 `package.json`: `rimraf` and `@types/lodash` moved to `devDependencies`. `build` cleans `dist` first
- v-0.0.4 `.swcrc`, `tsconfig.json`: removed path aliases that pointed outside the package
- v-0.0.4 `README.md`: rewritten

### added

- v-0.0.4 `utils.ts`: `updateCinMetaData`, `updateCinField` and `resolveCinTarget`, for writing decorators
- v-0.0.4 `cin-field-metadata.interface.ts`: `virtual` on a field
- v-0.0.4 `cin-relation.decorator.ts`: the `CinRelationDiscriminatorOptions` type
- v-0.0.4 `cin-expose.decorator.ts`: `normalizeExposeOption`
- v-0.0.4 `example/`: a complete example app, see `example/README.md`

### removed

- v-0.0.4 `package.json`: the unused `axios` dependency


## `v[0.0.127] - (2025-11-5)`
### add
- v-0.0.127 `model-option.ts`: add role for customComponent 




## `v[0.0.124] - (2025-3-29)`
### fixed
- v-0.0.124 `cin-crud-model.ts`: fixe call metaData function



## `v[0.0.121] - (2025-2-26)`

## added

- v-0.0.121 `cin-crud-model.ts`: add overrideMetaData

## `v[0.0.117] - (2025-1-16)`

### fixed

- v-0.0.117 `model.decorator.ts`: fix transformParamsField

## `v[0.0.116] - (2024-12-30)`

### added

- v-0.0.116 `model.decorator.ts`: added transform dataRepository
