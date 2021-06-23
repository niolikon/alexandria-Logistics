import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouterAuthGuardService implements CanActivate {
  
  constructor(public authService: AuthenticationService, public router: Router) {
  }

  canActivate(): boolean {
    if (!this.authService.getIsUserLogged()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
