import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ImageService } from '../service/image.service';


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
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  productUpdateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)] ],
    label: [''],
    price: ['', [Validators.required, Validators.min(0.0)]],
  });
  
  productUpdateFormErrors:IFormErrors = {
    name: '',
    description: '',
    label: '',
    price: ''
  };

  productUpdateValidationMessages:IFormValidationMessages = {
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

  productUpdateEnabled: boolean;

  // Data model management
  productIdParam: string;
  product: Product;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Product Image management
  productImageIdx: number;
  productImageSize: number;
  productImageDropFiles: NgxFileDropEntry[];

  constructor(private prodService: ProductService, private imageService: ImageService,
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String)  { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.productIdParam = '';
    this.product = Product.EMPTY;

    this.productImageIdx = -1;
    this.productImageSize = 0;
    this.productImageDropFiles = []

    this.productUpdateEnabled = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.route.params.subscribe(
      (params:Params) => {
        this.productIdParam = params['id'];
        this.refreshCard();
      },
      (error) => this.errorMessage = <any>error);
  }

  refreshCard() {
    this.prodService.getProduct(this.productIdParam)
      .subscribe((result) => {
        this.product = result;
        this.productImageIdx = 0;
        this.productImageSize = this.product.imageIds.length;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.product = Product.EMPTY;
          this.productImageIdx = -1;
          this.productImageSize = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  toggleEdit(event:MatSlideToggleChange) {
    this.productUpdateEnabled = event.checked;

    if (this.productUpdateEnabled) {
      this.productUpdateForm.reset(this.product);
      this.productUpdateForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
    }
  }

  onValueChanged(data?: any) {
    if (!this.productUpdateForm) { return; }
    const form = this.productUpdateForm;

    // Iterating over keys => one for each form input
    for (const field in this.productUpdateFormErrors) {
      if (this.productUpdateFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.productUpdateFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.productUpdateValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.productUpdateFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onProductUpdate() {
    let productUpdated = this.productUpdateForm.value;

    if (this.productUpdateEnabled) {
      this.prodService.updateProduct(this.productIdParam, productUpdated)
        .subscribe(
          (result) => {
            this.refreshCard();
            this.productUpdateEnabled = false;
            this.snackBar.open('Product update success', 'OK', { duration: 2000 });
          },
          (error) => {
            this.snackBar.open('Product update error', 'OK', { duration: 2000 });
          });

    }
  }

  onProductDelete() {
    this.prodService.deleteProduct(this.productIdParam)
      .subscribe(
        (result) => {
          this.snackBar.open('Product delete success', 'OK', { duration: 2000 });
          this.router.navigate(['inventory/products']);
        }, (error) => {
          this.snackBar.open('Product delete error', 'OK', { duration: 2000 });
        })
  }

  onImageDrop(files: NgxFileDropEntry[]) {
    this.productImageDropFiles = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file name
          //console.log(droppedFile.relativePath, file);

          this.imageService.addImage(file, this.productIdParam).subscribe(
            (result) => { 
              this.product.imageIds.push('' + result.id);
              this.productImageSize += 1;
              this.productImageIdx = this.productImageSize - 1;
              this.snackBar.open('Image upload success', 'OK', {duration: 2000});
            },
            (error) => {
              this.snackBar.open('Image upload error', 'OK', {duration: 2000});
            }
          );
        });
      }
    }
  }

  onImagePrev() {
    this.productImageIdx = (this.productImageIdx + this.product.imageIds.length - 1) % this.product.imageIds.length;
  }

  onImageDelete() {
    this.imageService.deleteImage( this.product.imageIds[this.productImageIdx])
      .subscribe((result) => { 
        this.product.imageIds.splice(this.productImageIdx, 1);
        this.productImageSize = this.product.imageIds.length;
        if (this.productImageSize == 0) {
          this.productImageIdx = -1;
        } else {
          this.productImageIdx = 0;
        }

        this.snackBar.open('Image delete success', 'OK', {duration: 2000});
      },
      (error) => {
        console.log('Error', error);
        this.snackBar.open('Image delete error', 'OK', {duration: 2000});
      });
  }

  onImageNext() {
    this.productImageIdx = (this.productImageIdx + 1) % this.product.imageIds.length;
  }
}
