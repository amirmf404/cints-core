import { CrudActionsEnum, FilterOperation } from "@metacrud/core";
import { User, UserStatus, userRepository } from "./models/user.model";

export interface DemoStep {
  title: string;
  description: string;
  result: unknown;
}

/**
 * Uses the `User` model the way a UI library would: everything goes through
 * the metadata, including the repository calls.
 */
export async function runDemo(): Promise<DemoStep[]> {
  const steps: DemoStep[] = [];
  const metadata = User.getMetaData();
  const repository = metadata.dataRepository!;

  const form = {
    fullName: "Alan Turing",
    email: "alan@example.com",
    password: "enigma",
    status: UserStatus.Active,
    company: 1,
  };
  const created = await repository.create({ entity: form });
  steps.push({
    title: "Create",
    description:
      "The form uses the field names of the model. The result uses them too.",
    result: created,
  });

  steps.push({
    title: "Stored row",
    description:
      "The repository received fullName and email under profile, as set with @CinDataPath.",
    result: userRepository.rows.find((row) => row.id === created.id),
  });

  const page = await repository.findPaginate({
    search: [
      { field: "fullName", operation: FilterOperation.ILIKE, value: "a" },
    ],
    filter: [
      { field: "status", operation: FilterOperation.EQ, value: UserStatus.Active },
    ],
    sortBy: ["-fullName"],
    limit: 5,
    page: 1,
  });
  steps.push({
    title: "Search, filter and sort",
    description:
      "Active users whose name contains “a”, sorted by fullName descending. The field names in search and sortBy are mapped to their data paths.",
    result: {
      itemCount: page.itemCount,
      names: page.items.map((item) => item.fullName),
    },
  });

  const updated = await repository.update({
    id: created.id,
    entity: { email: "turing@example.com" },
  });
  steps.push({
    title: "Update",
    description: "Only the email is sent, and it is stored as profile.email.",
    result: updated,
  });

  const [suspend] = metadata.actions.rowActions;
  await suspend.run!(updated);
  steps.push({
    title: `Row action “${suspend.label}”`,
    description: "Calls the static method User.suspend with the row.",
    result: await repository.findById({ id: created.id }),
  });

  const [countUsers] = metadata.actions.modelActions;
  steps.push({
    title: `Model action “${countUsers.label}”`,
    description: "Calls the run function given to @CinAction on the class.",
    result: countUsers.run!(),
  });

  steps.push({
    title: "Color handlers",
    description:
      "The row color comes from the static method, the status color from the field handler.",
    result: {
      row: metadata.colorHandler!(updated),
      status: metadata.fields.status.colorHandler!({
        status: UserStatus.Suspended,
      }),
    },
  });

  const createForm = Object.values(metadata.fields)
    .filter((field) => field.expose?.[CrudActionsEnum.Create]?.expose !== false)
    .map((field) => field.name);
  steps.push({
    title: "Fields of the create form",
    description: "Every field that is not excluded from the create action.",
    result: createForm,
  });

  const ReadOnlyUser = User.overrideMetaData({
    path: "read-only-users",
    createOptions: { enable: false },
    updateOptions: { enable: false },
    deleteOptions: { enable: false },
  });
  steps.push({
    title: "Override metadata",
    description:
      "overrideMetaData returns a new class with its own metadata, User is not changed.",
    result: {
      "ReadOnlyUser.path": ReadOnlyUser.getMetaData().path,
      "ReadOnlyUser.createOptions": ReadOnlyUser.getMetaData().createOptions,
      "User.path": User.getMetaData().path,
      "User.createOptions": User.getMetaData().createOptions,
    },
  });

  const deleted = await repository.delete({ id: created.id });
  steps.push({
    title: "Delete",
    description: "Removes the user that was created in the first step.",
    result: { deleted, remaining: userRepository.rows.length },
  });

  return steps;
}
