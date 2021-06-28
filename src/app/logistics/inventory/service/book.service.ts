import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inventoryBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Book, BookRequest } from '../model/book';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getBooks(pageNumber?:number, pageSize?:number): Observable<Paged<Book>> {
    let numberParam:string = `?page=${pageNumber || 0}`;
    let pageSizeParam:string = `&size=${pageSize || 100}`;
    
    return this.http.get<Paged<Book>>(inventoryBaseURL + 'books' + numberParam + pageSizeParam)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(inventoryBaseURL + 'books/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  insertBook(book: BookRequest): Observable<Book> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Book>(inventoryBaseURL + 'books', book, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updateBook(id: string, book: BookRequest): Observable<Book> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Book>(inventoryBaseURL + 'books/' + id, book, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  deleteBook(id: string): Observable<Book> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete<Book>(inventoryBaseURL + 'books/' + id, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
