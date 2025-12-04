import { PaginationOptions } from "./pagination-options.interface";
import { Pagination } from "./pagination.interface";

export interface DataRepository {}

export interface CrudDataRepository<T extends Record<string,unknown>=Record<string,unknown>> extends DataRepository {
  create({ entity, parent }: { entity: any; parent?: Record<any, any> }): any;
  findById({
    id,
    parent,
  }: {
    id: number | string;
    parent?: Record<any, any>;
  }): any;
  findPaginate({
    id,
    filter,
    search,
    sortBy,
    limit,
    page,
    parent,
  }: PaginationOptions): Promise<Pagination<T>>;

  update({
    entity,
    parent,
    id,
  }: {
    id: number | string;
    entity: any;
    parent?: Record<any, any>;
  }): any;
  delete({
    id,
    parent,
  }: {
    id: number | string;
    parent?: Record<any, any>;
  }): any;
}
// interface CrudDataRepositoryWithParent extends CrudDataRepository{

//   create({ entity }: {
//       entity: any;
//       parent?:any;
//   }): any;
//   findById({ id }: {
//       id: number | string;
//       parent?:any;
//   }): any;
//   findPaginate({ id, filter, search, sortBy, limit, page,parent }: PaginationOptions&{parent?:any}): Promise<Pagination>;
//   update({ entity, id }: {
//       id: number | string;
//       entity: any;
//       parent :any;
//   }): any;
//   delete({ id }: {
//       id: number | string;
//       parent :any;
//   }): any;
// }
