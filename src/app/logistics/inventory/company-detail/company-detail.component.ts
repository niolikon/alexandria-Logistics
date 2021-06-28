import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Company } from '../model/company';
import { CompanyService } from '../service/company.service';


export interface IFormErrors {
  name: string;
}

export interface IFormValidationMessages {
  name: object;
}

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  companyUpdateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
  });
  
  companyUpdateFormErrors:IFormErrors = {
    name: '',
  };

  companyUpdateValidationMessages:IFormValidationMessages = {
    name: {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 100 characters long.'
    },
  };

  companyUpdateEnabled: boolean;

  // Data model management
  companyIdParam: string;
  company: Company;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  constructor(private companyService: CompanyService,
    private route: ActivatedRoute, private router:Router, 
    private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String)  { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.companyIdParam = '';
    this.company = Company.EMPTY;

    this.companyUpdateEnabled = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.route.params.subscribe(
      (params:Params) => {
        this.companyIdParam = params['id'];
        this.refreshCard();
      },
      (error) => this.errorMessage = <any>error);
  }

  refreshCard() {
    this.companyService.getCompany(this.companyIdParam)
      .subscribe(
        (result) => {
          this.company = result;
          this.isLoading = false;
          this.isLoadingError = false;
          this.errorMessage = "";
        },
        (errmess) => {
          this.company = Company.EMPTY;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  toggleEdit(event:MatSlideToggleChange) {
    this.companyUpdateEnabled = event.checked;

    if (this.companyUpdateEnabled) {
      this.companyUpdateForm.reset(this.company);
      this.companyUpdateForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
    }
  }

  onValueChanged(data?: any) {
    if (!this.companyUpdateForm) { return; }
    const form = this.companyUpdateForm;

    // Iterating over keys => one for each form input
    for (const field in this.companyUpdateFormErrors) {
      if (this.companyUpdateFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.companyUpdateFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.companyUpdateValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.companyUpdateFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onCompanyUpdate() {
    let companyUpdated = this.companyUpdateForm.value;

    this.companyService.updateCompany(this.companyIdParam, companyUpdated)
      .subscribe(
        (result) => {
          this.refreshCard();
          this.companyUpdateEnabled = false;
          this.snackBar.open('Company update success', 'OK', { duration: 2000 });
        },
        (error) => {
          this.snackBar.open('Company update error', 'OK', { duration: 2000 });
        });
  }

  onCompanyDelete() {
    this.companyService.deleteCompany(this.companyIdParam)
      .subscribe(
        (result) => {
          this.snackBar.open('Company delete success', 'OK', { duration: 2000 });
          this.router.navigate(['inventory/companies']);
        },
        (error) => {
          this.snackBar.open('Company delete error', 'OK', { duration: 2000 });
        });
  }
}
