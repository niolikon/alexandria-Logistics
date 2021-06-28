import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { BookService } from '../service/book.service';
import { PageEvent } from '@angular/material/paginator';
import { BookNewComponent } from '../book-new/book-new.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {

  // Data model management
  books: Book[];
  booksTotal: number;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  booksTableColumns: string[];

  // Paginator management
  booksPaginatorSizeOptions: number[];
  booksPaginatorSize: number;
  booksPaginatorIndex: number;

  constructor(private prodService: BookService, public dialog: MatDialog) {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.books = [];
    this.booksTotal = 0;
    this.booksTableColumns = ['id', 'title', 'author', 'publisher', 'label', 'price', 'pages', 'isbn', 'action'];

    this.booksPaginatorIndex = 0;
    this.booksPaginatorSizeOptions = [5, 10, 25, 100];
    this.booksPaginatorSize = this.booksPaginatorSizeOptions[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.refreshTable();
  }

  refreshTable() {
    this.prodService.getBooks(this.booksPaginatorIndex, this.booksPaginatorSize)
      .subscribe((bookspage) => {
        this.books = bookspage.content;
        this.booksTotal = bookspage.totalElements;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.books = [];
          this.booksTotal = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  handlePaging(event: PageEvent) {
    this.booksPaginatorSize = event.pageSize;
    this.booksPaginatorIndex = event.pageIndex;

    this.refreshTable();
  }

  onBookNew() {
    const dialogRef = this.dialog.open(BookNewComponent, {width: '800px'});

    dialogRef.afterClosed()
      .subscribe(
        (result) => {
          this.refreshTable();
        });
  }
}
