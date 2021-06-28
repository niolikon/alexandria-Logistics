import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inventoryBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Company } from '../model/company';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getCompanies(pageNumber?:number, pageSize?:number): Observable<Paged<Company>> {
    let numberParam:string = `?page=${pageNumber || 0}`;
    let pageSizeParam:string = `&size=${pageSize || 100}`;
    
    return this.http.get<Paged<Company>>(inventoryBaseURL + 'companies' + numberParam + pageSizeParam)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(inventoryBaseURL + 'companies/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  insertCompany(company: Company): Observable<Company> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Company>(inventoryBaseURL + 'companies', company, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updateCompany(id: string, company: Company): Observable<Company> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Company>(inventoryBaseURL + 'companies/' + id, company, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  deleteCompany(id: string): Observable<Company> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete<Company>(inventoryBaseURL + 'companies/' + id, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
