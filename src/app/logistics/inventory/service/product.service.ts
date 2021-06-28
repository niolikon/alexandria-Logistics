import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inventoryBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Product, ProductRequest } from '../model/product';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getProducts(pageNumber?:number, pageSize?:number): Observable<Paged<Product>> {
    let numberParam:string = `?page=${pageNumber || 0}`;
    let pageSizeParam:string = `&size=${pageSize || 100}`;
    
    return this.http.get<Paged<Product>>(inventoryBaseURL + 'products' + numberParam + pageSizeParam)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(inventoryBaseURL + 'products/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  insertProduct(product: ProductRequest): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Product>(inventoryBaseURL + 'products', product, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updateProduct(id: string, product: ProductRequest): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Product>(inventoryBaseURL + 'products/' + id, product, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  deleteProduct(id: string): Observable<Product> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete<Product>(inventoryBaseURL + 'products/' + id, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
