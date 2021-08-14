import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book, BookRequest } from '../model/book';
import { BookService } from '../service/book.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ImageService } from '../service/image.service';
import { PersonService } from '../service/person.service';
import { CompanyService } from '../service/company.service';
import { Person } from '../model/person';
import { Company } from '../model/company';


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
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  bookUpdateForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)] ],
    authorId: [0],
    publisherId: [0],
    synopsis: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)] ],
    label: [''],
    price: ['', [Validators.required, Validators.min(0.0)]],
    pages: ['', [Validators.required, Validators.min(0.0)]],
    isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14)]],
  });
  
  bookUpdateFormErrors:IFormErrors = {
    title: '',
    authorId: '',
    publisherId: '',
    synopsis: '',
    label: '',
    price: '',
    pages: '',
    isbn: ''
  };

  bookUpdateValidationMessages:IFormValidationMessages = {
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

  bookUpdateEnabled: boolean;

  // Data model management
  bookIdParam: string;
  book: Book;

  authors:Person[];
  publishers:Company[];

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Book Image management
  bookImageIdx: number;
  bookImageSize: number;
  bookImageDropFiles: NgxFileDropEntry[];

  constructor(private bookService: BookService, private imageService: ImageService,
    private authorService: PersonService, private publisherService: CompanyService,
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL:String)  { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.bookIdParam = '';
    this.book = Book.EMPTY;

    this.authors = [];
    this.publishers = [];

    this.bookImageIdx = -1;
    this.bookImageSize = 0;
    this.bookImageDropFiles = []

    this.bookUpdateEnabled = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.route.params.subscribe(
      (params:Params) => {
        this.bookIdParam = params['id'];
        this.refreshCard();
      },
      (error) => this.errorMessage = <any>error);

    this.authorService.getPersons()
      .subscribe( 
        (authors) => {
          this.authors = authors.content;
        });

    this.publisherService.getCompanies()
      .subscribe( 
        (publishers) => {
          this.publishers = publishers.content;
        });
  }

  refreshCard() {
    this.bookService.getBook(this.bookIdParam)
      .subscribe((result) => {
        this.book = result;
        this.bookImageIdx = 0;
        this.bookImageSize = this.book.imageIds.length;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.book = Book.EMPTY;
          this.bookImageIdx = -1;
          this.bookImageSize = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  toggleEdit(event:MatSlideToggleChange) {
    this.bookUpdateEnabled = event.checked;

    if (this.bookUpdateEnabled) {
      let formData = <any>this.book;
      formData.authorId = this.book.author.id;
      formData.publisherId = this.book.publisher.id;

      this.bookUpdateForm.reset(formData);
      this.bookUpdateForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
      this.onValueChanged();
    }
  }

  onValueChanged(data?: any) {
    if (!this.bookUpdateForm) { return; }
    const form = this.bookUpdateForm;

    // Iterating over keys => one for each form input
    for (const field in this.bookUpdateFormErrors) {
      if (this.bookUpdateFormErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.bookUpdateFormErrors[field as keyof IFormErrors] = '';
        const control = form.get(field);
        // Checking if the control is loaded in page, if is dirty and invalid 
        if (control && control.dirty && !control.valid) {
          const messages = this.bookUpdateValidationMessages[field as keyof IFormValidationMessages];
          // Iterating over keys => one for detected error
          for (const key in control.errors) {
            // If we defined an error string for that validator error add it
            // We use hasOwnProperty since the validator adds a property in 
            // case of error -> error.email
            if (control.errors.hasOwnProperty(key)) {
              this.bookUpdateFormErrors[field as keyof IFormErrors] += messages[key as keyof object] + ' ';
            }
          }
        }
      }
    }
  }

  onBookUpdate() {
    let bookUpdated:BookRequest = this.bookUpdateForm.value;

    if (this.bookUpdateEnabled) {
      this.bookService.updateBook(this.bookIdParam, bookUpdated)
        .subscribe(
          (result) => {
            this.refreshCard();
            this.bookUpdateEnabled = false;
            this.snackBar.open('Book update success', 'OK', { duration: 2000 });
          },
          (error) => {
            this.snackBar.open('Book update error', 'OK', { duration: 2000 });
          });
    }
  }

  onBookDelete() {
    this.bookService.deleteBook(this.bookIdParam)
      .subscribe(
        (result) => {
          this.snackBar.open('Book delete success', 'OK', { duration: 2000 });
          this.router.navigate(['inventory/books']);
        }, (error) => {
          this.snackBar.open('Book delete error', 'OK', { duration: 2000 });
        })
  }

  onImageDrop(files: NgxFileDropEntry[]) {
    this.bookImageDropFiles = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file name
          //console.log(droppedFile.relativePath, file);

          this.imageService.addImage(file, this.bookIdParam).subscribe(
            (result) => { 
              this.book.imageIds.push('' + result.id);
              this.bookImageSize += 1;
              this.bookImageIdx = this.bookImageSize - 1;
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
    this.bookImageIdx = (this.bookImageIdx + this.book.imageIds.length - 1) % this.book.imageIds.length;
  }

  onImageDelete() {
    this.imageService.deleteImage( this.book.imageIds[this.bookImageIdx])
      .subscribe((result) => { 
        this.book.imageIds.splice(this.bookImageIdx, 1);
        this.bookImageSize = this.book.imageIds.length;
        if (this.bookImageSize == 0) {
          this.bookImageIdx = -1;
        } else {
          this.bookImageIdx = 0;
        }

        this.snackBar.open('Image delete success', 'OK', {duration: 2000});
      },
      (error) => {
        console.log('Error', error);
        this.snackBar.open('Image delete error', 'OK', {duration: 2000});
      });
  }

  onImageNext() {
    this.bookImageIdx = (this.bookImageIdx + 1) % this.book.imageIds.length;
  }
}
