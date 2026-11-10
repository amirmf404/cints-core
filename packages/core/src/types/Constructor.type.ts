export type ConstructorType<T = {}> = new (...arguments_: any[]) => T;
export type AbstractConstructorType<T = {}> = abstract new (
  ...arguments_: any[]
) => T;
