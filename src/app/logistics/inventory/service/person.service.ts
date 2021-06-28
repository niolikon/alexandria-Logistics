import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inventoryBaseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { Person } from '../model/person';
import { Paged } from 'src/app/commons/model/paged';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPersons(pageNumber?:number, pageSize?:number): Observable<Paged<Person>> {
    let numberParam:string = `?page=${pageNumber || 0}`;
    let pageSizeParam:string = `&size=${pageSize || 100}`;
    
    return this.http.get<Paged<Person>>(inventoryBaseURL + 'persons' + numberParam + pageSizeParam)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(inventoryBaseURL + 'persons/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  insertPerson(person: Person): Observable<Person> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Person>(inventoryBaseURL + 'persons', person, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updatePerson(id: string, person: Person): Observable<Person> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Person>(inventoryBaseURL + 'persons/' + id, person, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  deletePerson(id: string): Observable<Person> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.delete<Person>(inventoryBaseURL + 'persons/' + id, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
