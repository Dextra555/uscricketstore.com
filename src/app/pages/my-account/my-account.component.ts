import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'molla-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  currentUser: any;
  total_order_products = 0;
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

    this.getDashboardData();
  }

  logout() {
    this.apiService.logout();
  }

  getDashboardData() {
    this.apiService.getDashboardData().subscribe((result) => {
      this.total_order_products = result.total_order_products;
      this.spinner.stop();
    });
  }

  productsInWishlist() {
    var price: any;
    price = 0;
    var priceEls = document.getElementsByClassName('wishlist-count');
    for (var i = 0; i < priceEls.length; i++) {
      price = priceEls[i].innerHTML;
    }
    return price;
  }

  productsInCart() {
    var price: any;
    price = 0;
    var priceEls = document.getElementsByClassName('cart-count');
    for (var i = 0; i < priceEls.length; i++) {
      price = priceEls[i].innerHTML;
    }
    return price;
  }
}
