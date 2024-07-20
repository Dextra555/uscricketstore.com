import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { ModalService } from './../../../../../shared/services/modal.service';
import { ApiService } from './../../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from './../../../../../shared/services/wishlist.service';

@Component({
	selector: 'molla-wishlist-menu',
	templateUrl: './wishlist-menu.component.html',
	styleUrls: ['./wishlist-menu.component.scss']
})

export class WishlistMenuComponent implements OnInit, OnDestroy {
	wishcount=0;
	loggedin=false;
	subscription:any;
	constructor(private router: Router,public apiService: ApiService,public modalService: ModalService,
		private toastrService: ToastrService) { }

	ngOnInit(): void {
		this.subscription = this.apiService.isWishChanged.subscribe((status: boolean) => {
			if(status){
				this.getWishlist();
			}
		});
		this.getWishlist()
	}

	getWishlist(){
		if(!localStorage.getItem('currentUser')){
			this.wishcount=0
			this.loggedin=false;
		}else{
			this.loggedin=true;
			this.apiService.getWish().subscribe(result => {
				if(result.success){
					//this.toastrService.success(result.message);
					this.wishcount = result.data.length;
				}else{
					this.wishcount=0
					//this.toastrService.error(result.message);
				}
			},error=>{
				this.wishcount=0
			});
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
