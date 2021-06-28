import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookRequest } from '../model/book';
import { Company } from '../model/company';
import { Person } from '../model/person';
import { BookService } from '../service/book.service';
import { CompanyService } from '../service/company.service';
import { PersonService } from '../service/person.service';

export interface IFormErrors {
  title: string;
  authorId: string;
  publisherId: string;
  synopsis: string;
  label: string;
  price: string;
  pages: string;
  isbn: string;
}

export interface IFormValidationMessages {
  title: object;
  authorId: object;
  publisherId: object;
  synopsis: object;
  label: object;
  price: object;
  pages: object;
  isbn: object;
}

@Component({
  selector: 'app-book-new',
  templateUrl: './book-new.component.html',
  styleUrls: ['./book-new.component.scss']
})
export class BookNewComponent implements OnInit {

  bookInsertForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    authorId: [0],
    publisherId: [0],
    synopsis: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)] ],
    label: [''],
    price: ['', [Validators.required, Validators.min(0.0)]],
    pages: ['', [Validators.required, Validators.min(0.0)]],
    isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14)]],
  });
  
  bookInsertFormErrors:IFormErrors = {
    title: '',
    authorId: '',
    publisherId: '',
    synopsis: '',
    label: '',
    price: '',
    pages: '',
    isbn: ''
  };

  bookInsertValidationMessages:IFormValidationMessages = {
    title: {
      'required':      'Title is required.',
      'minlength':     'Title must be at least 2 characters long.',
      'maxlength':     'Title cannot be more than 100 characters long.'
    },
    authorId: {
    },
    publisherId: {
    },
    synopsis: {
      'required':      'Synopsis is required.',
      'minlength':     'Synopsis must be at least 2 characters long.',
      'maxlength':     'Synopsis cannot be more than 500 characters long.'
    },
    label: {

    },
    price: {
      'required':      'Price is required.',
      'min':           'Price must be non-negative.'
    },
    pages: {
      'required':      'Pages is required.',
      'min':           'Pages must be non-negative.'
    },
    isbn: {
      'required':      'ISBN is required.',
      'minlength':     'ISBN must be at least 10 characters long.',
      'maxlength':     'ISBN cannot be more than 14 characters long.'
    },
  };

  authors:Person[];
  publishers:Company[];

  constructor(private bookService: BookService,
    private authorService: PersonService, private publisherService: CompanyService,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String,
    public dialogRef: MatDialogRef<BookNewComponent>)  { 

      this.authors = [];
      this.publishers = [];
  }

  ngOnInit(): void {
    this.bookInsertForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    this.authorService.getPersons()
      .subscribe( 
        (authors) => {
          this.authors = authors.content;

          if (this.authors.length > 0) {
            let formValue:BookRequest = this.bookInsertForm.value;
            formValue.authorId = this.authors[0].id;
            this.bookInsertForm.setValue(formValue);
          }
        });

    this.publisherService.getCompanies()
      .subscribe( 
        (publishers) => {
          this.publishers = publishers.content;
          
          if (this.publishers.length > 0) {
            let formValue:BookRequest = this.bookInsertForm.value;
            formValue.publisherId = this.publishers[0].id;
            this.bookInsertForm.setValue(formValue);
          }
        });
  }

  onValueChanged(data?: any) {
    if (!this.bookInsertForm) { return; }
    const form = this.bookInsertForm;

    // Iterating over keys => one for each form input
    for (const field in this.bookInsertFormErrors) {
      if (this.bookInsertFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.bookInsertFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.bookInsertValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.bookInsertFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onBookInsert() {
    let bookData:BookRequest = this.bookInsertForm.value;

    this.bookService.insertBook(bookData)
    .subscribe(
      (result) => {
        this.snackBar.open('Book insert success', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      (error) => { 
        this.snackBar.open('Book insert error', 'OK', { duration: 2000 });
        this.dialogRef.close();
      });
  }

  onBookCancel() {
    this.dialogRef.close();
  }
}
