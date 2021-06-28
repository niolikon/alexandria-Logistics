import { Component, OnInit } from '@angular/core';
import { Person } from '../model/person';
import { PersonService } from '../service/person.service';
import { PageEvent } from '@angular/material/paginator';
import { PersonNewComponent } from '../person-new/person-new.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent implements OnInit {

  // Data model management
  persons: Person[];
  personsTotal: number;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  personsTableColumns: string[];

  // Paginator management
  personsPaginatorSizeOptions: number[];
  personsPaginatorSize: number;
  personsPaginatorIndex: number;

  constructor(private prodService: PersonService, public dialog: MatDialog) {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.persons = [];
    this.personsTotal = 0;
    this.personsTableColumns = ['id', 'name', 'surname', 'action'];

    this.personsPaginatorIndex = 0;
    this.personsPaginatorSizeOptions = [5, 10, 25, 100];
    this.personsPaginatorSize = this.personsPaginatorSizeOptions[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.refreshTable();
  }

  refreshTable() {
    this.prodService.getPersons(this.personsPaginatorIndex, this.personsPaginatorSize)
      .subscribe((personspage) => {
        this.persons = personspage.content;
        this.personsTotal = personspage.totalElements;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.persons = [];
          this.personsTotal = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  handlePaging(event: PageEvent) {
    this.personsPaginatorSize = event.pageSize;
    this.personsPaginatorIndex = event.pageIndex;

    this.refreshTable();
  }

  onPersonNew() {
    const dialogRef = this.dialog.open(PersonNewComponent, {width: '400px'});

    dialogRef.afterClosed()
      .subscribe(
        (result) => {
          this.refreshTable();
        });
  }
}
