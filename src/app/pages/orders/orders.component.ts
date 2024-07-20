import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'molla-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  loadingOrders = false;
  orders = [];
  page = 1;
  totalOrders;
  currentUser: any;
  constructor(
    private router: Router,
    public apiService: ApiService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.spinner.start();
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.router.navigate(['/']);
    }
    this.getOrders(this.page);
  }

  loadmore() {
    this.page = this.page + 1;
    this.getOrders(this.page);
  }

  getOrders(page) {
    if (!this.loadingOrders) {
      this.loadingOrders = true;
      this.apiService.fetchOrders(page).subscribe((result) => {
        this.orders = [...this.orders, ...result.data];
        this.page = result.meta.current_page;
        this.totalOrders = result.meta.total;
        this.loadingOrders = false;
        this.spinner.stop();
      });
    }
  }

  totalItems(order) {
    let items = 0;
    for (let item of order.orders) {
      items += item.products.data.length;
    }
    return items;
  }
}
