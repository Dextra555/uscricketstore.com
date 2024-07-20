import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import imagesLoaded from 'imagesloaded';

import { Product } from './../../../../shared/classes/product';
import { environment } from './../../../../../environments/environment';

import { ApiService } from './../../../../shared/services/api.service';
import { CartService } from './../../../../shared/services/cart.service';
import { CompareService } from './../../../../shared/services/compare.service';
import { UtilsService } from './../../../../shared/services/utils.service';
import { WishlistService } from './../../../../shared/services/wishlist.service';
import { sliderOpt } from './../../../../shared/data';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;

@Component({
  selector: 'quick-view-inner-modal',
  templateUrl: './quick-view-inner-modal.component.html',
  styleUrls: ['./quick-view-inner-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickViewInnerModalComponent implements OnInit {
  @Input() product1;
  @Input() loaded;
  @Input() loaded1;

  constructor(
    public apiService: ApiService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public compareService: CompareService,
    public utilsService: UtilsService,
    public router: Router,
    private spinner: NgxUiLoaderService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    this.spinner.start();
  }

  closeQuickView() {
    let modal = document.querySelector(
      '.quickViewInnerModal-modal'
    ) as HTMLElement;
    if (modal) modal.click();
  }
}
