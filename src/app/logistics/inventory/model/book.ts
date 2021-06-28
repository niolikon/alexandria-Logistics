import { Company } from "./company";
import { Person } from "./person";

export class Book {
    id: number;
    title: string;
    synopsis: string;
    pages: number;
    isbn: string;
    author: Person;
    publisher:Company;
    label: string;
    imageIds: string[];
    price: number;
    
    constructor(id: number, title: string, synopsis: string,
        pages: number, isbn: string, author:Person, publisher:Company,
        label: string, imageIds: string[], price: number) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.pages = pages;
        this.isbn = isbn;
        this.author = author;
        this.publisher = publisher;
        this.label = label;
        this.imageIds = imageIds;
        this.price = price;
    }

    static EMPTY: Book = {
        id: 0, title: '', synopsis: '', pages: -1, isbn: '',
        author: Person.EMPTY, publisher: Company.EMPTY,
        label: '', imageIds: [], price: 0
    };
}

export class BookRequest {
    id: number;
    title: string;
    synopsis: string;
    pages: number;
    isbn: string;
    authorId: number;
    publisherId:number;
    label: string;
    price: number;
    
    constructor(id: number, title: string, synopsis: string,
        pages: number, isbn: string, authorId:number, publisherId:number,
        label: string, imageIds: string[], price: number) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.pages = pages;
        this.isbn = isbn;
        this.authorId = authorId;
        this.publisherId = publisherId;
        this.label = label;
        this.price = price;
    }

    static EMPTY: BookRequest = {
        id: 0, title: '', synopsis: '', pages: -1, isbn: '',
        authorId: 0, publisherId: 0, label: '', price: 0
    };
}