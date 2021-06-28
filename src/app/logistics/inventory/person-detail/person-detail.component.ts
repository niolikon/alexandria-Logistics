import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Person } from '../model/person';
import { PersonService } from '../service/person.service';


export interface IFormErrors {
  name: string;
  surname: string;
}

export interface IFormValidationMessages {
  name: object;
  surname: object;
}

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit {

  personUpdateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
  });
  
  personUpdateFormErrors:IFormErrors = {
    name: '',
    surname: ''
  };

  personUpdateValidationMessages:IFormValidationMessages = {
    name: {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 100 characters long.'
    },
    surname: {
      'required':      'Surname is required.',
      'minlength':     'Surname must be at least 2 characters long.',
      'maxlength':     'Surname cannot be more than 100 characters long.'
    },
  };

  personUpdateEnabled: boolean;

  // Data model management
  personIdParam: string;
  person: Person;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  constructor(private personService: PersonService,
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String)  { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.personIdParam = '';
    this.person = Person.EMPTY;

    this.personUpdateEnabled = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.route.params.subscribe(
      (params:Params) => {
        this.personIdParam = params['id'];
        this.refreshCard();
      },
      (error) => this.errorMessage = <any>error);
  }

  refreshCard() {
    this.personService.getPerson(this.personIdParam)
      .subscribe(
        (result) => {
          this.person = result;
          this.isLoading = false;
          this.isLoadingError = false;
          this.errorMessage = "";
        },
        (errmess) => {
          this.person = Person.EMPTY;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  toggleEdit(event:MatSlideToggleChange) {
    this.personUpdateEnabled = event.checked;

    if (this.personUpdateEnabled) {
      this.personUpdateForm.reset(this.person);
      this.personUpdateForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
    }
  }

  onValueChanged(data?: any) {
    if (!this.personUpdateForm) { return; }
    const form = this.personUpdateForm;

    // Iterating over keys => one for each form input
    for (const field in this.personUpdateFormErrors) {
      if (this.personUpdateFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.personUpdateFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.personUpdateValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.personUpdateFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onPersonUpdate() {
    let personUpdated = this.personUpdateForm.value;

    this.personService.updatePerson(this.personIdParam, personUpdated)
      .subscribe(
        (result) => {
          this.refreshCard();
          this.personUpdateEnabled = false;
          this.snackBar.open('Person update success', 'OK', { duration: 2000 });
        },
        (error) => {
          this.snackBar.open('Person update error', 'OK', { duration: 2000 });
        });
  }

  onPersonDelete() {
    this.personService.deletePerson(this.personIdParam)
      .subscribe(
        (result) => {
          this.snackBar.open('Person delete success', 'OK', { duration: 2000 });
          this.router.navigate(['inventory/persons']);
        },
        (error) => {
          this.snackBar.open('Person delete error', 'OK', { duration: 2000 });
        });
  }
}
