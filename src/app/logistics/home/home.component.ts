import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/service/authentication.service';
import { Subscription } from 'rxjs';

interface IFormErrors {
  username: string;
  password: string;
}
interface IFormValidationMessages {
  username: object;
  password: object;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
  });

  @ViewChild('fform') 
  loginFormDirective: any;

  formErrors:IFormErrors = {
    username: '',
    password: ''
  };

  validationMessages:IFormValidationMessages = {
    username: {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 2 characters long.',
      'maxlength':     'Username cannot be more than 25 characters long.'
    },
    password: {
      'required':      'Password is required.',
      'minlength':     'Password must be at least 2 characters long.',
      'maxlength':     'Password cannot be more than 25 characters long.'
    }
  };

  loginResponseString:string = '';
  loginResponseStatus:boolean = false;
  loginRequested:boolean = false;

  logged: Boolean = this.authService.getIsUserLogged();
  loggedSubscription: Subscription = Subscription.EMPTY;

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.registerFormActions();

    this.loggedSubscription = this.authService.observeIsUserLogged()
    .subscribe(value => this.logged = value);
  }

  registerFormActions() {
    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

    this.loginResponseString = '';
    this.loginResponseStatus = false;
    this.loginRequested = false;

    // Iterating over keys => one for each form input
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    let credentials = this.loginForm.value;
    this.loginRequested = true;
    this.loginResponseStatus = true;

    this.authService.doLogIn(credentials)
    .subscribe(
      result => {
        if (! result.success) {
          this.loginResponseString = 'Your login attempt has failed. Make sure the username and password are correct.';
          this.loginResponseStatus = false;
        }
      },
      (error) => { 
        this.loginResponseString = 'Your login attempt has failed. Make sure the username and password are correct.';
        this.loginResponseStatus = false;
      })
    ;
  }
}
