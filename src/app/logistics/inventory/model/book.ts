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
    featured: boolean;
    
    constructor(id: number, title: string, synopsis: string,
        pages: number, isbn: string, author:Person, publisher:Company,
        label: string, imageIds: string[], price: number, featured: boolean) {
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
        this.featured = featured;
    }

    static EMPTY: Book = {
        id: 0, title: '', synopsis: '', pages: -1, isbn: '',
        author: Person.EMPTY, publisher: Company.EMPTY,
        label: '', imageIds: [], price: 0, featured: false
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
    featured: boolean;
    
    constructor(id: number, title: string, synopsis: string,
        pages: number, isbn: string, authorId:number, publisherId:number,
        label: string, price: number, featured: boolean) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.pages = pages;
        this.isbn = isbn;
        this.authorId = authorId;
        this.publisherId = publisherId;
        this.label = label;
        this.price = price;
        this.featured = featured;
    }

    static fromJSObject(book:any):BookRequest {
        let result:BookRequest = new BookRequest(book.id as number, 
            book.title as string, book.synopsis as string,
            book.pages as number, book.isbn as string, 
            book.authorId as number, book.publisherId as number,
            book.label as string, book.price as number, 
            book.featured as boolean);
        return result;
    }

    static fromBook(book:Book):BookRequest {
        let result:BookRequest = new BookRequest(book.id, 
            book.title, book.synopsis, book.pages, book.isbn, 
            book.author.id, book.publisher.id, book.label, 
            book.price, book.featured);
        return result;
    }

    static EMPTY: BookRequest = {
        id: 0, title: '', synopsis: '', pages: -1, isbn: '',
        authorId: 0, publisherId: 0, label: '', price: 0, featured: false
    };
}