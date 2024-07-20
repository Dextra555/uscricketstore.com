import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModalService } from './../../../shared/services/modal.service';
import { ApiService } from './../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { environment } from './../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'shop-wishlist-page',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishItems = [];
  items: any = [];
  loaded = false;
  SERVER_URL = environment.SERVER_URL;

  private subscr: Subscription;

  constructor(
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.spinner.start();
    if (!localStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/');
    }
    this.getWishlist();
    this.subscr = this.apiService.removeProduct.subscribe((id) => {
      this.items = this.items.filter((item) => item.id !== id);
    });
  }

  getWishlist() {
    if (!localStorage.getItem('currentUser')) {
      this.router.navigateByUrl('/');
    } else {
      this.apiService.getWish().subscribe((result) => {
        if (result.success) {
          //this.toastrService.success(result.message);
          this.items = result.data;
          this.convertWish();
          this.loaded = true;
          this.spinner.stop();
        } else {
          this.toastrService.error(result.message);
          this.spinner.stop();
        }
      });
    }
  }

  convertWish() {
    this.wishItems = this.items.reduce((acc, cur) => {
      let max = 0;
      let min = 999999;
      if (min > cur.price) min = cur.price;
      if (max < cur.price) max = cur.price;

      if (cur.variations.length == 0) {
        min = cur.base_discounted_price
          ? cur.base_discounted_price
          : cur.base_price;
        max = cur.base_price;
      } else {
        cur.variations.reduce((acc1, cur1) => {
          if (min > cur1.price) min = parseInt(cur1.price);
          if (max < cur1.price) max = parseInt(cur1.price);
          return acc1;
        }, []);
      }
      return [
        ...acc,
        {
          ...cur,
          minPrice: min,
          maxPrice: max,
        },
      ];
    }, []);
  }

  removeFromWish(product) {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
    } else {
      this.apiService.removeFromoWish(product.id).subscribe((result) => {
        if (result.success) {
          this.apiService.wishChanged(true);
          // this.wishItems = this.wishItems.filter((prod) => {
          //   return prod.id != product.id;
          // });
          this.toastrService.success(result.message);
        } else {
          this.toastrService.error(result.message);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscr?.unsubscribe();
  }
}
