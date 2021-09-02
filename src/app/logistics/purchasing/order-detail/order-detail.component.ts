import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Product } from '../../inventory/model/product';
import { ProductService } from '../../inventory/service/product.service';
import { Order, OrderEntry, OrderRequest, OrderStatus } from '../model/order';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  // Data model management
  orderIdParam: string;
  order: Order;
  orderProducts: Product[];
  orderProductQuantityMap: Map<Number,Number>;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  orderProductsTableColumns: string[];

  constructor(private orderService: OrderService, private prodService: ProductService, 
    private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar,
    @Inject('inventoryBaseURL') public baseURL: String) {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';
    
    this.orderIdParam = '';
    this.order = Order.EMPTY;
    this.orderProducts = [];
    this.orderProductQuantityMap = new Map<Number,Number>();

    this.orderProductsTableColumns = ['id', 'name', 'quantity'];
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.route.params.subscribe(
      (params:Params) => {
        this.orderIdParam = params['id'];
        this.refreshCard();
      },
      (error:any) => this.errorMessage = <any>error);
  }  

  refreshCard() {
    this.orderService.getOrder(this.orderIdParam)
    .subscribe((result) => {
      let productObservables:Observable<Product>[] = result.entries.map( (entry:OrderEntry) => this.prodService.getProduct('' + entry.productId));

      // For each entry
      forkJoin(productObservables)
      .subscribe({
        next: (productArray) => {
          this.order = result;
          this.orderProducts = productArray;

          this.orderProductQuantityMap = new Map<Number,Number>();
          this.order.entries.forEach( (entry) => {
            this.orderProductQuantityMap.set(entry.productId, entry.quantity);
          });

          this.isLoading = false;
          this.isLoadingError = false;
          this.errorMessage = "";
        },
        error: (error) => {
          // Error happened
          this.order = Order.EMPTY;
          this.orderProducts = [];
          this.orderProductQuantityMap = new Map<Number,Number>();
          
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>error;
  
        }
      });
    },
    (errmess) => {
      this.order = Order.EMPTY;
      this.orderProducts = [];
      this.orderProductQuantityMap = new Map<Number,Number>();
      
      this.isLoading = false;
      this.isLoadingError = true;
      this.errorMessage = <any>errmess;

    });
  }
  
  changeStatus(event: MatButtonToggleChange) {
    let newStatus = String(event.value);
    switch (newStatus) {
      case 'NEW':
        this.order.status = OrderStatus.NEW;
        break;

      case 'PACKING':
        this.order.status = OrderStatus.PACKING;
        break;

      case 'SHIPPED':
        this.order.status = OrderStatus.SHIPPED;
        break;

      default:
        this.order.status = OrderStatus.NEW;
        break;
    }

    let orderRequest: OrderRequest = OrderRequest.fromOrder(this.order);
    this.orderService.updateOrder(String(this.order.id), orderRequest)
      .subscribe((updatedorder) => {
        this.refreshCard();
        this.snackBar.open('Status update success', 'OK', { duration: 2000 });
      },
      (errmess) => {
        this.snackBar.open('Status update error', 'OK', { duration: 2000 });
    });
  }
}
