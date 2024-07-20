import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from './../../../../shared/classes/product';

import { ModalService } from './../../../../shared/services/modal.service';
import { CartService } from './../../../../shared/services/cart.service';
import { WishlistService } from './../../../../shared/services/wishlist.service';
import { CompareService } from './../../../../shared/services/compare.service';
import { ApiService } from './../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

import { environment } from './../../../../../environments/environment';

@Component({
	selector: 'molla-product-related',
	templateUrl: './product-related.component.html',
	styleUrls: ['./product-related.component.scss']
})

export class ProductRelatedComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	@Input() product;

	maxPrice = 0;
	minPrice = 99999;

	SERVER_URL = environment.SERVER_URL;

	constructor(
		private router: Router,
		private modalService: ModalService,
		private cartService: CartService,
		private wishlistService: WishlistService,
		private compareService: CompareService,
		public apiService: ApiService,
		private toastrService: ToastrService
	) { }

	ngOnInit(): void {
		let min = this.minPrice;
		let max = this.maxPrice;
		// this.variationGroup = this.product.variations.reduce((acc, cur) => {
		// 	cur.size.map(item => {
		// 		acc.push({
		// 			color: cur.color,
		// 			colorName: cur.color_name,
		// 			size: item.name,
		// 			price: cur.price
		// 		});
		// 	});
		// 	if (min > cur.price) min = cur.price;
		// 	if (max < cur.price) max = cur.price;
		// 	return acc;
		// }, []);

		this.product.variations.reduce((acc, cur) => {
			if (min > cur.price) min = cur.price;
			if (max < cur.price) max = cur.price;
		}, []);

		if (this.product.variations.length == 0) {
			min = this.product.base_discounted_price
				? this.product.base_discounted_price
				: this.product.base_price;
			max = this.product.base_price;
		}

		this.minPrice = min;
		this.maxPrice = max;
	}

	// addToCart(event: Event) {
	// 	event.preventDefault();
	// 	this.cartService.addToCart(this.product);
	// }

	// addToWishlist(event: Event) {
	// 	event.preventDefault();

	// 	if (this.isInWishlist()) {
	// 		this.router.navigate(['/shop/wishlist']);
	// 	} else {
	// 		this.wishlistService.addToWishList(this.product);
	// 	}
	// }

	// addToCompare(event: Event) {
	// 	event.preventDefault();
	// 	if (this.isInCompare()) return;
	// 	this.compareService.addToCompare(this.product);
	// }

	// quickView(event: Event) {
	// 	event.preventDefault();
	// 	this.modalService.showQuickView(this.product);
	// }

	// isInCompare() {
	// 	return this.compareService.isInCompare(this.product);
	// }

	// isInWishlist() {
	// 	return this.wishlistService.isInWishlist(this.product);
	// }


	navigate(slug){
		this.router.navigate(['/product/'+slug]);
	}


	navigate2(slug){
		this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
			this.router.navigate(['/product/'+slug]);
		});
	}


	addToWish(product) {
		if(!localStorage.getItem('currentUser')){
			this.modalService.showLoginModal();
		}else{
			this.apiService.addToWish(product.id).subscribe(result => {
				if(result.success){
					this.toastrService.success(result.message);
					this.apiService.wishChanged(true);
					product.wishlisted=1;
				}else{
					product.toastrService.error(result.message,'Error');
				}
			});
		}
	}

	removeFromWish(product) {
		if(!localStorage.getItem('currentUser')){
			this.modalService.showLoginModal();
		}else{
			this.apiService.removeFromoWish(product.id).subscribe(result => {
				if(result.success){
					this.toastrService.success(result.message);
					this.apiService.wishChanged(true);
					product.wishlisted=0;
				}else{
					this.toastrService.error(result.message);
				}
			});
		}
	}


	quickView(product,loaded){
		this.modalService.showQuickViewInnerModal(product,loaded)
	}

	addToCart(product) {

		let variation=0;
		if(product.is_variant && parseInt(product.is_variant)!==0){
			this.quickView(product,true)
			return true;
		}else{
			variation = product?.variations[0]?.id;
		}
		product.loading=true;
		let temp_user_id = '';
		if(localStorage.getItem('temp_user_id')){
			temp_user_id = localStorage.getItem('temp_user_id')
		}
		let addons=[];
		this.apiService.addToCart(1, temp_user_id,variation,addons).subscribe(result => {
			if(result.success){
				this.toastrService.success(result.message);
				this.apiService.cartChanged(true);
			}else{
				this.toastrService.error(result.message);
			}
			product.loading=false;
		});
		return true;
	}
}
