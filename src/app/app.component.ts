import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/services/api.service';

import { Store } from '@ngrx/store';

import { StoreService } from './core/store/store.service';
import { UtilsService } from './shared/services/utils.service';

import { RefreshStoreAction } from 'src/app/core/actions/actions';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
	selector: 'molla-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	header_menu_left: any;
	header_menu_right: any;
	social_links: any;
	currentUser = null;
  assetPath = environment.ASSET_PATH;
	constructor(
		public store: Store<any>,
		public router: Router,
		public viewPort: ViewportScroller,
		public storeService: StoreService,
		public utilsService: UtilsService,
		public modalService: NgbModal,
		public apiService: ApiService
	) {

		this.getMenu();
		const navigationEnd = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		);

		navigationEnd.pipe(first()).subscribe(() => {
			document.querySelector('body')?.classList.add('loaded');
			var timer = setInterval(() => {
				if (window.getComputedStyle(document.querySelector('body')).visibility == 'visible') {
					clearInterval(timer);
					$('.owl-carousel').trigger('refresh.owl.carousel');
				}
			}, 300);
		});

		navigationEnd.subscribe((event: any) => {
			if (!event.url.includes('/shop/sidebar') && !event.url.includes('/shop/nosidebar') && !event.url.includes('/shop/market') && !event.url.includes('/blog')) {
				this.viewPort.scrollToPosition([0, 0]);
			}

			this.modalService.dismissAll();
		})

		if (localStorage.getItem("molla-angular-demo") !== environment.demo) {
			this.store.dispatch(new RefreshStoreAction());
		}

		localStorage.setItem("molla-angular-demo", environment.demo);
	}

	getMenu() {
		if (localStorage.getItem('currentUser')) {
			this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
		}


		if (!localStorage.getItem('temp_user_id') && !this.currentUser) {
			let d = Date.now();
			localStorage.setItem('temp_user_id', d.toString())
		}

		this.apiService.fetchHeaderData({}).subscribe(result => {
			this.header_menu_left = result.header_menu_left;
			this.header_menu_right = result.header_menu_right;
			this.social_links = result.social_link;

		})
	}

	@HostListener('window: scroll', ['$event'])
	onWindowScroll(e: Event) {
		this.utilsService.setStickyHeader();
	}

	hideMobileMenu() {
		document.querySelector('body').classList.remove('mmenu-active');
		document.querySelector('html').style.overflowX = 'unset';
	}
}
