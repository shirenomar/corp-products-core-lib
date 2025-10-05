import { Observable } from 'rxjs';
import { ListOptions } from './list-options.interface';
import { PAGE_SIZE_OPTION, PAGESIZE, SortDirection } from './pagination';
export abstract class BasePaginationService<T = any> {
  totalRecords = 0;
  totalPages = 0;
  rowsChange: number = PAGESIZE;

  pageSizes = PAGE_SIZE_OPTION;
  defaultSortValue = 'createdAt';
  defaultSortDirection = SortDirection.DESC;
  first: number | undefined = 0;

  listOptions: ListOptions = {
    searchValue: '',
    paginator: this.rowsChange,
    page: 0,
    direction: this.defaultSortDirection,
    sortBy: this.defaultSortValue,
  };

  abstract getList(listOptions: ListOptions): void | Observable<T>;

  createListFilter(filters: { [key: string]: unknown }): void {
    this.listOptions = {
      ...this.listOptions,
      ...filters,
    };
  }

  resetList(): void {
    this.listOptions = {
      searchValue: '',
      paginator: this.rowsChange,
      page: 0,
    };
  }

  resetPaginator(): void {
    this.listOptions = {
      ...this.listOptions,
      paginator: this.rowsChange,
      page: 0,
    };
  }

  onPageChange(event: any): void {
    this.listOptions = {
      ...this.listOptions,
      page: event.page,
      paginator: event.rows,
    };
    this.first = event.first ?? 0;
    this.getList(this.listOptions);
  }
}
