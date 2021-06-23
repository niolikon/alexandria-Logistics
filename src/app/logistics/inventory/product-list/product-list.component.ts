import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  productsLength: number;

  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  productsTable: any;
  productsTableColumns: string[];

  constructor(private prodService:ProductService) { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.products = [];
    this.productsLength = 0;
    this.productsTableColumns = ['id', 'name', 'description', 'label', 'image', 'price', 'action'];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.prodService.getProducts()
      .subscribe((productspage) => {
          this.products = productspage.content;
          this.productsLength = productspage.numberOfELements;
          this.isLoading = false;
          this.isLoadingError = false;
          this.errorMessage = "";
        },
        (errmess) => {
          this.products = [];
          this.productsLength = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

}
