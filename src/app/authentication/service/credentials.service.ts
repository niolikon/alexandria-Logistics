import { Injectable } from '@angular/core';
import { Credentials } from '../model/credentials';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  static TOKEN_STORAGE_KEY: string = 'JWT';
  
  private credentials: Credentials = {username: '', token: ''};
  private credentialsValid: boolean = false;

  constructor() { 
    this.loadCredentials();
  }

  getCredentials(): Credentials {
    return this.credentials;
  }

  isStatusValid(): boolean {
    return this.credentialsValid;
  }

  loadCredentials() {
    let tokenStoredValue = localStorage.getItem(CredentialsService.TOKEN_STORAGE_KEY);

    if (tokenStoredValue !== null) {
      this.credentials = JSON.parse(<string>tokenStoredValue);

      if (this.credentials.username.length !== 0 && this.credentials.token.length !== 0) {
        this.credentialsValid = true;
      }
      else {
        this.credentialsValid = false;
      }
    }
    else {
      this.credentialsValid = false;
    }
  }

  storeCredentials(credentials: Credentials) {
    localStorage.setItem(CredentialsService.TOKEN_STORAGE_KEY, JSON.stringify(credentials));

    if (this.credentials.username.length !== 0 && this.credentials.token.length !== 0) {
      this.credentialsValid = true;
    }
    else {
      this.credentialsValid = false;
    }
  }

  destroyCredentials() {
    localStorage.removeItem(CredentialsService.TOKEN_STORAGE_KEY);
  }
}
