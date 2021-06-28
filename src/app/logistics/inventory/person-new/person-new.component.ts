import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selector: 'app-person-new',
  templateUrl: './person-new.component.html',
  styleUrls: ['./person-new.component.scss']
})
export class PersonNewComponent implements OnInit {

  personInsertForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
  });
  
  personInsertFormErrors:IFormErrors = {
    name: '',
    surname: ''
  };

  personInsertValidationMessages:IFormValidationMessages = {
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

  constructor(private personService: PersonService,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String,
    public dialogRef: MatDialogRef<PersonNewComponent>)  { 
  }

  ngOnInit(): void {
    this.personInsertForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.personInsertForm) { return; }
    const form = this.personInsertForm;

    // Iterating over keys => one for each form input
    for (const field in this.personInsertFormErrors) {
      if (this.personInsertFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.personInsertFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.personInsertValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.personInsertFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onPersonInsert() {
    let personData:Person = this.personInsertForm.value;

    this.personService.insertPerson(personData)
    .subscribe(
      (result) => {
        this.snackBar.open('Person insert success', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      (error) => { 
        this.snackBar.open('Person insert error', 'OK', { duration: 2000 });
        this.dialogRef.close();
      });
  }

  onPersonCancel() {
    this.dialogRef.close();
  }
}

