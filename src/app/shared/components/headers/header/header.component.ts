import { Component, OnInit, OnDestroy, Input, Renderer2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { UtilsService } from './../../../../shared/services/utils.service';
import { ModalService } from './../../../../shared/services/modal.service';
import { ApiService } from './../../../../shared/services/api.service';
import { AuthService } from './../../../../shared/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'molla-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  assetPath = environment.ASSET_PATH;

	@Input() containerClass = "container";

	private subscr: Subscription;
	subscription:any;

	categories = [];
	header_menu_left = [];
	header_menu_right = [];
	out_of_stock: number[] = [];
	helpline='';
	logo='';
	contactEmail='';
	left_right = '6_4';
	totalCount = 0;
	loaded = false;
	params = [];
	currentUser:any = [];

	loggedin:boolean = false;

	constructor(public router: Router, public render: Renderer2, public utilsService: UtilsService, public authService: AuthService, public modalService: ModalService, public apiService: ApiService) {
		this.subscr = this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				if (event.url === '/') {
					document.querySelector('.header').classList.add('position-absolute');
				} else {
					document.querySelector('.header').classList.contains('position-absolute') && document.querySelector('.header').classList.remove('position-absolute')
				}
			} else if (event instanceof NavigationEnd) {
				if (event.url === '/') {
					document.querySelector('.header').classList.add('position-absolute');
				} else {
					document.querySelector('.header').classList.contains('position-absolute') && document.querySelector('.header').classList.remove('position-absolute')
				}
			}
		});
		this.params['left_right'] =  this.left_right;
		this.apiService.fetchHeaderData(this.params).subscribe(result => {
      // console.log('result.out_of_stock_menu',result.out_of_stock_menu);
			this.categories = result.mobile_app_links;
			this.header_menu_left = result.header_menu_left;
			this.header_menu_right = result.header_menu_right;
			this.out_of_stock = result.out_of_stock_menu;
			this.helpline = result.helpline;
			this.logo = result.logo;
			this.contactEmail = result.contact_email;
			//this.totalCount = result.totalCount;

			this.loaded = true;

			//this.utilsService.scrollToPageContent();
		})

	}

	ngOnInit(): void {
		this.subscription = this.authService.isLogged.subscribe((status: boolean) => {
			if(status){
				this.loggedin = true;
			}else{
				this.loggedin = false;
			}
		});
		this.getCurrentUser();
	}


	getCurrentUser() {
	let user = localStorage.getItem('currentUser');
	if(user){
		this.currentUser = JSON.parse(user)
		this.loggedin = true;
	}
	}


	ngOnDestroy(): void {
		this.subscr.unsubscribe();
		this.subscription.unsubscribe();
	}

	showLoginModal(event: Event): void {
		event.preventDefault();
		this.modalService.showLoginModal();
	}

  toggleMenu(event: any) {
		const body = document.querySelector('body');
		const html = document.querySelector('html');

		if (body.classList.contains('mmenu-active') || event.target.classList.contains('mobile-menu-overlay')) {
			this.render.removeClass(body, 'mmenu-active');
			this.render.removeAttribute(html, 'style')
		} else {
			this.render.addClass(body, 'mmenu-active');
			this.render.setStyle(html, 'overflow-x', 'hidden');
		}
	}
}
