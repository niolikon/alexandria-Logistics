interface ISortable {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

interface IPageable {
    sort: ISortable;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;

}

export class Paged<T> {
    content: T[];

    pageable: IPageable;

    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;

    sort: ISortable;

    first: boolean;
    numberOfELements: number;
    empty: boolean;

    constructor(content: T[], pageable: IPageable, last: boolean,
        totalPages: number, totalElements: number, size: number, number: number,
        sort: ISortable, first: boolean, numberOfELements: number, empty: boolean) 
    {
            this.content = content;
            this.pageable = pageable;
            this.last = last;
            this.totalPages = totalPages;
            this.totalElements = totalElements;
            this.size = size;
            this.number = number;
            this.sort = sort;
            this.first = first;
            this.numberOfELements = numberOfELements;
            this.empty = empty;
    }
}
