# metacrud

Framework-agnostic, metadata-driven CRUD.

You describe a model once: its fields, their types, validation, visibility, layout hints, actions and the repository that loads and saves it. `metacrud` turns that description into one plain metadata object that a UI layer can render as forms, tables and pages.

The goal of this project is that the same model works in Vue, React and Angular, and that models can be defined and changed at runtime.

## Status

`metacrud` is a fork of [`cints-core`](https://github.com/amirmf404/cints-core) 0.0.4. Today it contains the same library under a new name, in a workspace that has room for more packages. The framework adapters do not exist yet, and nothing is published to npm.

## Packages

| Path                                 | Package                  | What it is                                                      |
| ------------------------------------ | ------------------------ | --------------------------------------------------------------- |
| [`packages/core`](./packages/core)   | `@metacrud/core`         | The metadata toolkit. It has no UI and no framework dependency. |
| [`examples/basic`](./examples/basic) | `metacrud-example-basic` | A Vite app with three models and an in-memory repository.       |

The API reference is in [`packages/core/README.md`](./packages/core/README.md).

## Development

The workspace uses [pnpm](https://pnpm.io) and Node 20 or newer.

```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run the tests
pnpm typecheck    # type-check all packages
pnpm format       # format with Prettier
```

Run the example:

```bash
pnpm build
pnpm --filter metacrud-example-basic dev
```

## Changelog

Every change is listed in [`CHANGELOG.md`](./CHANGELOG.md), under "Unreleased" until it is part of a release. Add an entry in the same commit as the change.

## Relation to `cints-core`

The git history of `cints-core` is kept in this repository. The `upstream` remote points at it for reference; pushing to it is disabled in the local clone that created this fork.
