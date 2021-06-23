import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Product } from '../model/product';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getProducts(pageNumber?:number, pagesize?:number): Observable<Paged<Product>> {
    return this.http.get<Paged<Product>>(baseURL + 'products')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(baseURL + 'products/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
