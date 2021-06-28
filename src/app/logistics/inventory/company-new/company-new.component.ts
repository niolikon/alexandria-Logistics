import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Company } from '../model/company';
import { CompanyService } from '../service/company.service';


export interface IFormErrors {
  name: string;
}

export interface IFormValidationMessages {
  name: object;
}

@Component({
  selector: 'app-company-new',
  templateUrl: './company-new.component.html',
  styleUrls: ['./company-new.component.scss']
})
export class CompanyNewComponent implements OnInit {

  companyInsertForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
  });
  
  companyInsertFormErrors:IFormErrors = {
    name: '',
  };

  companyInsertValidationMessages:IFormValidationMessages = {
    name: {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 100 characters long.'
    },
  };

  constructor(private companyService: CompanyService,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String,
    public dialogRef: MatDialogRef<CompanyNewComponent>)  { 
  }

  ngOnInit(): void {
    this.companyInsertForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.companyInsertForm) { return; }
    const form = this.companyInsertForm;

    // Iterating over keys => one for each form input
    for (const field in this.companyInsertFormErrors) {
      if (this.companyInsertFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.companyInsertFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.companyInsertValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.companyInsertFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onCompanyInsert() {
    let companyData:Company = this.companyInsertForm.value;

    this.companyService.insertCompany(companyData)
    .subscribe(
      (result) => {
        this.snackBar.open('Company insert success', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      (error) => { 
        this.snackBar.open('Company insert error', 'OK', { duration: 2000 });
        this.dialogRef.close();
      });
  }

  onCompanyCancel() {
    this.dialogRef.close();
  }
}

