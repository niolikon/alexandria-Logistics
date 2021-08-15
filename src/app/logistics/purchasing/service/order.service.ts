import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { purchasingBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Order, OrderRequest } from '../model/order';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getOrders(pageNumber?:number, pageSize?:number): Observable<Paged<Order>> {
    let numberParam:string = `?page=${pageNumber || 0}`;
    let pageSizeParam:string = `&size=${pageSize || 100}`;
    
    return this.http.get<Paged<Order>>(purchasingBaseURL + 'orders' + numberParam + pageSizeParam)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updateOrder(id: string, order: OrderRequest): Observable<Order> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Order>(purchasingBaseURL + 'orders/' + id, order, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
