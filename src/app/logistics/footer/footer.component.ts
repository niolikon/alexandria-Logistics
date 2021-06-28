import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  logged: Boolean;
  loggedSubscription: Subscription;

  constructor(private authService: AuthenticationService) {
    this.loggedSubscription = Subscription.EMPTY; 
    this.logged = false;
  }

  ngOnInit(): void {
    this.loggedSubscription = this.authService.observeIsUserLogged()
      .subscribe( value => this.logged = value);
  }

  ngOnDestroy() {
    this.loggedSubscription.unsubscribe();
  }
}
