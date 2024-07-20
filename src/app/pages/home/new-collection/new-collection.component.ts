import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { newSlider } from '../data';

@Component({
  selector: 'molla-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss'],
})
export class NewCollectionComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  @Input() products;
  @Input() title = 'Latest Products';
  @Input() loaded = false;

  @Input() sliderOption;

  constructor(
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  navigate(slug) {
    this.router.navigate(['/product/' + slug]);
  }

  addToWish(product) {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
    } else {
      this.apiService.addToWish(product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.apiService.wishChanged(true);
          product.wishlisted = 1;
        } else {
          product.toastrService.error(result.message, 'Error');
        }
      });
    }
  }

  quickView(product, loaded) {
    this.modalService.showQuickViewInnerModal(product, loaded);
  }

  removeFromWish(product) {
    if (!localStorage.getItem('currentUser')) {
      this.modalService.showLoginModal();
    } else {
      this.apiService.removeFromoWish(product.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.apiService.wishChanged(true);
          product.wishlisted = 0;
        } else {
          this.toastrService.error(result.message);
        }
      });
    }
  }

  addToCart(product) {
    let variation = 0;
    if (product.is_variant && parseInt(product.is_variant) !== 0) {
      this.quickView(product, true);
      return true;
    } else {
      variation = product?.variations[0]?.id;
    }
    product.loading = true;
    let temp_user_id = '';
    if (localStorage.getItem('temp_user_id')) {
      temp_user_id = localStorage.getItem('temp_user_id');
    }
    let addons = [];
    this.apiService
      .addToCart(1, temp_user_id, variation, addons)
      .subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.apiService.cartChanged(true);
        } else {
          this.toastrService.error(result.message);
        }
        product.loading = false;
      });
    return true;
  }
}
