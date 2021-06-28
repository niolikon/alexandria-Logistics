import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { JWTResponse } from '../dto/jwtresponse';
import { AuthResponse } from '../dto/authresponse';

import { baseURL } from '../baseurl';
import { ProcessHTTPMsgService } from 'src/app/commons/service/process-httpmsg-service.service';
import { CredentialsService } from './credentials.service';
import { Credentials } from '../model/credentials';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userDataSubject: Subject<User> = new Subject<User>();
  private isLoggedSubject: Subject<Boolean> = new Subject<Boolean>();

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService,
    private credentialsService: CredentialsService) {

    this.initStatus();
  }

  observeUserData(): Observable<User> {
    return this.userDataSubject.asObservable();
  }

  observeIsUserLogged(): Observable<Boolean> {
    return this.isLoggedSubject.asObservable();
  }

  getIsUserLogged(): Boolean {
    return (this.credentialsService.isStatusValid());
  }

  initStatus() {
    if (! this.credentialsService.isStatusValid()) {
      this.isLoggedSubject.next(false);
    } else {
      this.doCheckJWTtoken();
    }
  }

  propagateLoginStatus(user?: User) {
    if (user !== undefined) {
      this.userDataSubject.next(user);
    }

    this.isLoggedSubject.next(true);
  }

  propagateLogoutStatus() {
    this.userDataSubject.next(undefined);
    this.isLoggedSubject.next(false);
  }

  doLogIn(user: any): Observable<any> {
   /************************************
    * TEST CODE
    ************************************
    let userDetails:User = {
      username: 'simone',
      firstname: 'Simone',
      lastname: 'Muscas',
      facebookId: '',
      roles: ['operator','admin']
    };
    let credentials:Credentials = { username: userDetails.username, token: '0123456789' };
    this.credentialsService.storeCredentials(credentials);
    this.propagateLoginStatus(userDetails);
    return of({ 'success': true, 'username': credentials.username });
    */

    return this.http.post<AuthResponse>(baseURL + 'users/login',
      { 'username': user.username, 'password': user.password })
      .pipe(map(res => {
        let credentials:Credentials = { username: user.username, token: res.token };
        this.credentialsService.storeCredentials(credentials);
        this.doCheckJWTtoken();
        return { 'success': true, 'username': credentials.username };
      }),
        catchError(error => this.processHTTPMsgService.handleError(error)));
  }

  doLogOut() {
    this.credentialsService.destroyCredentials();
    this.propagateLogoutStatus();
  }

  doCheckJWTtoken() {
    this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken')
      .subscribe(result => {
          console.log('JWT token valid');
          this.propagateLoginStatus(result.user);
        }, 
        err => {
          console.log('JWT token notvalid');
          this.propagateLogoutStatus();
          this.credentialsService.destroyCredentials();
        });
  }
}
