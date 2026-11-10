import { describe, expect, it } from "vitest";
import {
  CinCrudModel,
  CinDataPath,
  CinFieldType,
  CinId,
  CinModel,
  CinNumber,
  CinSearchable,
  CinText,
  CrudDataRepository,
} from "../src";

function createRepository() {
  const calls: Record<string, unknown>[] = [];
  const repository: CrudDataRepository = {
    create: async (args) => {
      calls.push(structuredClone(args));
      return args.entity;
    },
    update: async (args) => {
      calls.push(structuredClone(args));
      return args.entity;
    },
    findById: async () => ({ id: 1, name: "Ada", stats: { visits: 0 } }),
    findPaginate: async (options) => ({ ...options, items: [], itemCount: 0 }),
    delete: async () => undefined,
  };
  return { repository, calls };
}

function createUserModel() {
  const { repository, calls } = createRepository();

  @CinCrudModel({ dataRepository: repository })
  class UserModel extends CinModel {
    @CinId() id!: number;

    @CinSearchable()
    @CinText()
    name!: string;

    @CinDataPath("stats.visits")
    @CinNumber()
    visits!: number;
  }

  return { UserModel, calls };
}

describe("model metadata", () => {
  it("derives the model name and path from the class", () => {
    const metadata = createUserModel().UserModel.getMetaData();

    expect(metadata.modelName).toBe("User");
    expect(metadata.path).toBe("user");
  });

  it("collects the decorated fields", () => {
    const { fields } = createUserModel().UserModel.getMetaData();

    expect(Object.keys(fields).sort()).toEqual(["id", "name", "visits"]);
    expect(fields.id.type).toBe(CinFieldType.Identifier);
    expect(fields.name).toMatchObject({ type: CinFieldType.Text, searchable: true, label: "name" });
    expect(fields.visits).toMatchObject({ type: CinFieldType.Number, dataPath: "stats.visits" });
  });
});

describe("data repository", () => {
  it("lifts values from their data path, including falsy ones", async () => {
    const { dataRepository } = createUserModel().UserModel.getMetaData();

    const user = await dataRepository!.findById({ id: 1 });

    expect(user.visits).toBe(0);
  });

  it("writes values to their data path", async () => {
    const { UserModel, calls } = createUserModel();

    await UserModel.getMetaData().dataRepository!.create({ entity: { name: "Ada", visits: 3 } });

    expect(calls[0].entity).toEqual({ name: "Ada", stats: { visits: 3 } });
  });
});
