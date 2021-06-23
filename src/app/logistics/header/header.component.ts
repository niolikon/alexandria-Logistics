import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  username: string = '';
  userDataSubscription: Subscription = Subscription.EMPTY;

  logged: Boolean = false;
  loggedSubscription: Subscription = Subscription.EMPTY;

  routeUrl: string = '/home';  

  constructor(private authService: AuthenticationService,
    private router: Router) { 
  }

  ngOnInit(): void {
    this.loggedSubscription = this.authService.observeIsUserLogged()
      .subscribe(value => this.logged = value);
    this.userDataSubscription = this.authService.observeUserData()
      .subscribe(value => this.username = value?.username || '');
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.routeUrl = event.url;
        }
    });
  }

  ngOnDestroy() {
    this.loggedSubscription.unsubscribe();
  }

  logOut() {
    this.authService.doLogOut();
    this.router.navigate(['home']);
  }
}
