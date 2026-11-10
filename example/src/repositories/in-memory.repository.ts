import {
  CrudDataRepository,
  FilterOperation,
  FilterOption,
  Pagination,
  PaginationOptions,
} from "cints-core";

type Entity = Record<string, unknown>;
type Id = number | string;

function getPath(entity: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    return typeof value === "object" && value !== null
      ? (value as Entity)[key]
      : undefined;
  }, entity);
}

function compare(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;
  return a < b ? -1 : 1;
}

function contains(value: unknown, term: unknown): boolean {
  return String(value ?? "")
    .toLowerCase()
    .includes(String(term ?? "").toLowerCase());
}

function matches(entity: Entity, { field, operation, value }: FilterOption) {
  const actual = getPath(entity, field);

  switch (operation) {
    case FilterOperation.EQ:
      return actual === value;
    case FilterOperation.NE:
      return actual !== value;
    case FilterOperation.GT:
      return compare(actual, value) > 0;
    case FilterOperation.GTE:
      return compare(actual, value) >= 0;
    case FilterOperation.LT:
      return compare(actual, value) < 0;
    case FilterOperation.LTE:
      return compare(actual, value) <= 0;
    case FilterOperation.IN:
      return Array.isArray(value) && (value as unknown[]).includes(actual);
    case FilterOperation.LIKE:
    case FilterOperation.ILIKE:
      return contains(actual, value);
    default:
      throw new Error(`Filter operation ${operation} is not supported`);
  }
}

/**
 * A `CrudDataRepository` that keeps its rows in memory. A real application
 * would call an HTTP API here instead.
 *
 * Rows are stored exactly as they are received, so `rows` shows the payload
 * shape that cints-core produced from the `@CinDataPath` mappings.
 */
export class InMemoryRepository<T extends Entity = Entity>
  implements CrudDataRepository<T>
{
  private items: T[];
  private nextId: number;

  constructor(seed: T[] = []) {
    this.items = structuredClone(seed);
    this.nextId =
      Math.max(0, ...this.items.map((item) => Number(item.id) || 0)) + 1;
  }

  /** A copy of the stored rows, for inspection. */
  get rows(): T[] {
    return structuredClone(this.items);
  }

  async create({ entity }: { entity: T }): Promise<T> {
    const item = { ...structuredClone(entity), id: this.nextId++ };
    this.items.push(item);
    return structuredClone(item);
  }

  async findById({ id }: { id: Id }): Promise<T | undefined> {
    return structuredClone(this.items[this.indexOf(id)]);
  }

  async findPaginate({
    filter = [],
    search = [],
    sortBy = [],
    limit = 10,
    page = 1,
  }: PaginationOptions = {}): Promise<Pagination<T>> {
    let items = this.items.filter(
      (item) =>
        // Every filter must match, and at least one search term.
        filter.every((option) => matches(item, option)) &&
        (search.length === 0 || search.some((option) => matches(item, option)))
    );

    // Apply the sort keys from last to first, the first one is the primary.
    for (const key of [...sortBy].reverse()) {
      const descending = key.startsWith("-");
      const path = descending ? key.slice(1) : key;
      items = [...items].sort(
        (a, b) =>
          compare(getPath(a, path), getPath(b, path)) * (descending ? -1 : 1)
      );
    }

    const start = (page - 1) * limit;
    return {
      items: structuredClone(items.slice(start, start + limit)),
      itemCount: items.length,
      pageCount: Math.ceil(items.length / limit),
      limit,
      page,
    };
  }

  async update({ id, entity }: { id: Id; entity: Partial<T> }): Promise<T> {
    const index = this.indexOf(id);
    if (index === -1) throw new Error(`Row ${id} does not exist`);

    // Merge one level deep, so a partial nested object keeps its other keys.
    const current = this.items[index] as Entity;
    const next: Entity = { ...current };
    for (const [key, value] of Object.entries(structuredClone(entity))) {
      const previous = current[key];
      next[key] =
        isPlainObject(value) && isPlainObject(previous)
          ? { ...previous, ...value }
          : value;
    }
    next.id = current.id;

    this.items[index] = next as T;
    return structuredClone(this.items[index]);
  }

  async delete({ id }: { id: Id }): Promise<boolean> {
    const index = this.indexOf(id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  private indexOf(id: Id): number {
    return this.items.findIndex((item) => String(item.id) === String(id));
  }
}

function isPlainObject(value: unknown): value is Entity {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
