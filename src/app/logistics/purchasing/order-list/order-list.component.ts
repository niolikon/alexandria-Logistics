import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Order, OrderRequest, OrderStatus } from '../model/order';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  // Data model management
  orders: Order[];
  ordersTotal: number;

  // Data loading management
  isLoading: boolean;
  isLoadingError: boolean;
  errorMessage: string;

  // Table presentation management
  ordersTableColumns: string[];

  // Paginator management
  ordersPaginatorIndex: number;
  ordersPaginatorSizeOptions: number[];
  ordersPaginatorSize: number;

  constructor(private orderService: OrderService, public dialog: MatDialog) { 
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = '';

    this.orders = [];
    this.ordersTotal = 0;
    this.ordersTableColumns = ['id', 'username', 'items', 'status', 'creation', 'updated', 'action'];

    this.ordersPaginatorIndex = 0;
    this.ordersPaginatorSizeOptions = [5, 10, 25, 100];
    this.ordersPaginatorSize = this.ordersPaginatorSizeOptions[1];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoadingError = false;
    this.errorMessage = "";

    this.refreshTable();
  }

  refreshTable() {
    this.orderService.getOrders(this.ordersPaginatorIndex, this.ordersPaginatorSize)
      .subscribe((orderspage) => {
        let orderArray:Order[] = [];
        for (let order of orderspage.content) {
          orderArray.push( Order.fromJSObject(order));
        }

        this.orders = orderArray;
        this.ordersTotal = orderspage.totalElements;
        this.isLoading = false;
        this.isLoadingError = false;
        this.errorMessage = "";
      },
        (errmess) => {
          this.orders = [];
          this.ordersTotal = 0;
          this.isLoading = false;
          this.isLoadingError = true;
          this.errorMessage = <any>errmess;
        });
  }

  handlePaging(event: PageEvent) {
    this.ordersPaginatorIndex = event.pageIndex;
    this.ordersPaginatorSize = event.pageSize;

    this.refreshTable();
  }

  revertOrder(order: Order) {
    switch (order.status) {
      case 'NEW':
        order.status = OrderStatus.NEW;
        break;

      case 'PACKING':
        order.status = OrderStatus.NEW;
        break;

      case 'SHIPPED':
        order.status = OrderStatus.PACKING;
        break;

      default:
        order.status = OrderStatus.NEW;
        break;
    }

    let orderRequest: OrderRequest = OrderRequest.fromOrder(order);
    this.orderService.updateOrder(String(order.id), orderRequest)
      .subscribe((updatedorder) => {
        this.refreshTable();
      },
        (errmess) => {
      });
  }

  advanceOrder(order: Order) {
    switch (order.status) {
      case 'NEW':
        order.status = OrderStatus.PACKING;
        break;

      case 'PACKING':
        order.status = OrderStatus.SHIPPED;
        break;

      case 'SHIPPED':
        order.status = OrderStatus.SHIPPED;
        break;

      default:
        order.status = OrderStatus.NEW;
        break;
    }

    let orderRequest: OrderRequest = OrderRequest.fromOrder(order);
    this.orderService.updateOrder(String(order.id), orderRequest)
      .subscribe((updatedorder) => {
        this.refreshTable();
      },
        (errmess) => {
      });
  }
}
