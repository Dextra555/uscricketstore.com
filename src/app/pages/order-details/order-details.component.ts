import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'molla-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  order: any;
  currentUser: any;
  onlyLane = false;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public modalService: ModalService,
    private toastrService: ToastrService,
    public apiService: ApiService
  ) {
    activeRoute.params.subscribe((params) => {
      this.apiService.fetchOrderDetails(params['id']).subscribe((result) => {
        if (result === null) {
          // this.router.navigate(['/pages/404']);
          this.router.navigate(['']);
        }

        this.order = result.data;
        this.setOnlyLane();
      });
    });
  }

  setOnlyLane() {
    let hasotherproduct = false;
    for (let innerOrder of this.order.orders) {
      for (let product of innerOrder.products.data) {
        if (!product.booked_slots || product.booked_slots.length == 0) {
          hasotherproduct = true;
        }
      }
    }
    if (!hasotherproduct) {
      this.onlyLane = true;
    }
  }

  hasProductType(innerorder, type = 'product') {
    let hasproducttype = false;
    for (let product of innerorder.products.data) {
      if (
        (!product.booked_slots || product.booked_slots.length == 0) &&
        type == 'product'
      ) {
        hasproducttype = true;
      } else if (
        product.booked_slots &&
        product.booked_slots?.booking_date &&
        type == 'lane'
      ) {
        hasproducttype = true;
      }
    }
    return hasproducttype;
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.router.navigate(['/']);
    }
  }

  itemTotal(item) {
    let sum1 = 0;
    sum1 += parseFloat(item.price);
    for (let item1 of item.product_addons) {
      sum1 += parseFloat(item1.price);
    }
    return sum1;
  }

  payNow() {
    this.apiService.checkInventory(this.order.code).subscribe((result) => {
      if (result.success) {
        window.open(this.order.payment_link, '_blank');
      } else {
        this.toastrService.error(result.message);
      }
    });
  }

  addReview(product) {
    this.modalService.showReviewFormModal(product);
  }
}
