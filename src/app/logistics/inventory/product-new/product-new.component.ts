import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductRequest } from '../model/product';
import { ProductService } from '../service/product.service';

export interface IFormErrors {
  name: string;
  description: string;
  label: string;
  price: string;
}

export interface IFormValidationMessages {
  name: object;
  description: object;
  label: object;
  price: object;
}

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.scss']
})
export class ProductNewComponent implements OnInit {

  productInsertForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)] ],
    label: [''],
    price: ['', [Validators.required, Validators.min(0.0)]],
  });
  
  productInsertFormErrors:IFormErrors = {
    name: '',
    description: '',
    label: '',
    price: ''
  };

  productInsertValidationMessages:IFormValidationMessages = {
    name: {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 100 characters long.'
    },
    description: {
      'required':      'Description is required.',
      'minlength':     'Description must be at least 2 characters long.',
      'maxlength':     'Description cannot be more than 500 characters long.'
    },
    label: {

    },
    price: {
      'required':      'Price is required.',
      'min':           'Price must be non-negative.'
    },
  };

  constructor(private productService: ProductService,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String,
    public dialogRef: MatDialogRef<ProductNewComponent>)  { 
  }

  ngOnInit(): void {
    this.productInsertForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.productInsertForm) { return; }
    const form = this.productInsertForm;

    // Iterating over keys => one for each form input
    for (const field in this.productInsertFormErrors) {
      if (this.productInsertFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.productInsertFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.productInsertValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.productInsertFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onProductInsert() {
    let productData:ProductRequest = this.productInsertForm.value;

    this.productService.insertProduct(productData)
    .subscribe(
      (result) => {
        this.snackBar.open('Product insert success', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      (error) => { 
        this.snackBar.open('Product insert error', 'OK', { duration: 2000 });
        this.dialogRef.close();
      });
  }

  onProductCancel() {
    this.dialogRef.close();
  }
}
