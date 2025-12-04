export interface CinActionInterface {
  name?: string | undefined;
  icon: string;
  label?: string;
  DataRepository?: unknown;
  //todo handle object type
  run?: (...args: unknown[]) => void;
}

export interface Actions {
  rowActions: CinActionInterface[];
  modelActions: CinActionInterface[];
}
