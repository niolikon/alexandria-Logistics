import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company';
import { CompanyService } from '../service/company.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CompanyNewComponent } from '../company-new/company-new.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  // Data model management
  companies: Company[];
  companiesTotal: number;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  companiesTableColumns: string[];

  // Paginator management
  companiesPaginatorSizeOptions: number[];
  companiesPaginatorSize: number;
  companiesPaginatorIndex: number;

  constructor(private compService: CompanyService, public dialog: MatDialog) {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.companies = [];
    this.companiesTotal = 0;
    this.companiesTableColumns = ['id', 'name', 'action'];

    this.companiesPaginatorIndex = 0;
    this.companiesPaginatorSizeOptions = [5, 10, 25, 100];
    this.companiesPaginatorSize = this.companiesPaginatorSizeOptions[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.refreshTable();
  }

  refreshTable() {
    this.compService.getCompanies(this.companiesPaginatorIndex, this.companiesPaginatorSize)
      .subscribe((companiespage) => {
        this.companies = companiespage.content;
        this.companiesTotal = companiespage.totalElements;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.companies = [];
          this.companiesTotal = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  handlePaging(event: PageEvent) {
    this.companiesPaginatorSize = event.pageSize;
    this.companiesPaginatorIndex = event.pageIndex;

    this.refreshTable();
  }

  onCompanyNew() {
    const dialogRef = this.dialog.open(CompanyNewComponent, {width: '400px'});

    dialogRef.afterClosed()
      .subscribe(
        (result) => {
          this.refreshTable();
        });
  }
}
