# Basic example

A small Vite app that describes three models with `@metacrud/core` and shows what the library makes of them.

- The first part of the page lists the metadata of each model: its path, the enabled pages and every field with its type and options.
- The second part uses the `User` model the way a UI library would. It creates, searches, updates and deletes a user through `User.getMetaData().dataRepository`, runs the actions and reads the color handlers.

## Run it

The example uses the build of the library in `packages/core`, so build that first. Run these in the repository root:

```bash
pnpm install
pnpm build                                  # builds @metacrud/core
pnpm --filter metacrud-example-basic dev
```

`pnpm --filter metacrud-example-basic build` type-checks the example and builds it for production.

## Files

| File                                        | What it shows                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/models/user.model.ts`                  | A full model: field types, visibility, validation, tabs and sections, data paths, a relation, an embedded object, actions and colors. |
| `src/models/company.model.ts`               | A minimal model with a repository. `User.company` refers to it.                                 |
| `src/models/address.model.ts`               | An embedded model without pages or repository. `User.address` uses it.                          |
| `src/repositories/in-memory.repository.ts`  | A `CrudDataRepository` with filtering, search, sorting and paging. Replace it with API calls in a real app. |
| `src/demo.ts`                               | The calls made through the metadata.                                                            |
| `src/main.ts`                               | Renders the page.                                                                               |

## Things to notice

- `fullName` and `email` are stored under `profile` in the repository. The model maps them with `@CinDataPath`, so the form, the search and the sort all use the plain field names. The "Stored row" step shows the nested shape that the repository received.
- `password` is only part of the create form: it is exposed on create and excluded everywhere else.
- `Address` passes an options object without any page, so all its pages are disabled.
- `overrideMetaData` creates a read-only variant of `User` without changing `User`.
