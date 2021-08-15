import { Component, OnInit } from '@angular/core';
import { Product, ProductRequest } from '../model/product';
import { ProductService } from '../service/product.service';
import { PageEvent } from '@angular/material/paginator';
import { ProductNewComponent } from '../product-new/product-new.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  // Data model management
  products: Product[];
  productsTotal: number;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  productsTableColumns: string[];

  // Paginator management
  productsPaginatorSizeOptions: number[];
  productsPaginatorSize: number;
  productsPaginatorIndex: number;

  constructor(private prodService: ProductService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.products = [];
    this.productsTotal = 0;
    this.productsTableColumns = ['id', 'name', 'description', 'label', 'type', 'price', 'featured', 'action'];

    this.productsPaginatorIndex = 0;
    this.productsPaginatorSizeOptions = [5, 10, 25, 100];
    this.productsPaginatorSize = this.productsPaginatorSizeOptions[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.refreshTable();
  }

  refreshTable() {
    this.prodService.getProducts(this.productsPaginatorIndex, this.productsPaginatorSize)
      .subscribe((productspage) => {
        this.products = productspage.content;
        this.productsTotal = productspage.totalElements;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.products = [];
          this.productsTotal = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  handlePaging(event: PageEvent) {
    this.productsPaginatorSize = event.pageSize;
    this.productsPaginatorIndex = event.pageIndex;

    this.refreshTable();
  }

  onProductNew() {
    const dialogRef = this.dialog.open(ProductNewComponent, {width: '800px'});

    dialogRef.afterClosed()
      .subscribe(
        (result) => {
          this.refreshTable();
        });
  }

  onToggleFeatured(product:Product) {
    let updatedProduct:ProductRequest = ProductRequest.fromProduct(product);
    updatedProduct.featured = (!product.featured);

    this.prodService.updateProduct(String(product.id), updatedProduct)
      .subscribe(
        (result) => {
          this.refreshTable();
          this.snackBar.open('Product update success', 'OK', { duration: 2000 });
        },
        (error) => {
          this.snackBar.open('Product update error', 'OK', { duration: 2000 });
        });

  }
}
