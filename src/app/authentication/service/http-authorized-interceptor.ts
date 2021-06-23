import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { CredentialsService } from './credentials.service';
import { Observable } from 'rxjs';
import { Credentials } from '../model/credentials';

@Injectable()
export class HttpAuthorizedInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private credentialsService:CredentialsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.credentialsService.isStatusValid()) {
      let credentials:Credentials = this.credentialsService.getCredentials();

      // Clone the request and Authorization header with user credentials.
      const authReq = req.clone({headers: req.headers.set('Authorization', 'bearer ' + credentials.token)});
      // Pass on the cloned request instead of the original request.
      return next.handle(authReq);
    }
    
    // Pass the original request.
    return next.handle(req);
  }
}