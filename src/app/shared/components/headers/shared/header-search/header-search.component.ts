import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from './../../../../../shared/services/api.service';
import { ModalService } from './../../../../../shared/services/modal.service';
import { UtilsService } from './../../../../../shared/services/utils.service';

import { environment } from './../../../../../../environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'molla-header-search',
	templateUrl: './header-search.component.html',
	styleUrls: ['./header-search.component.scss']
})

export class HeaderSearchComponent implements OnInit, OnDestroy {

	products = [];
	searchTerm = "";
	cat = null;
	suggestions = [];
	loggedin:boolean = false;
  subscription: any;
	timer: any;
	SERVER_URL = environment.SERVER_URL;

	constructor(public activeRoute: ActivatedRoute, public router: Router, public utilsService: UtilsService, public modalService: ModalService,
    public authService: AuthService, public apiService: ApiService) {
	}

	ngOnInit(): void {
    this.subscription = this.authService.isLogged.subscribe(
      (status: boolean) => {
        if (status) {
          this.loggedin = true;
        } else {
          this.loggedin = false;
        }
      }
    );
		this.getCurrentUser();
		document.querySelector('body').addEventListener('click', this.closeSearchForm);
	}

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
		document.querySelector('body').removeEventListener('click', this.closeSearchForm);
  }

	getCurrentUser() {
		  let user = localStorage.getItem('currentUser');
      if(user){
        this.loggedin = true;
      }
	  }


  showLoginModal(event: Event): void {
	event.preventDefault();
	this.modalService.showLoginModal();
	}

	searchProducts(event: any) {
		this.searchTerm = event.target.value;
		// if (this.searchTerm.length > 2) {
		// 	if (this.timer) {
		// 		window.clearTimeout(this.timer);
		// 	}

		// 	this.timer = setTimeout(() => {
		// 		this.apiService.fetchHeaderSearchData(this.searchTerm).subscribe(result => {
		// 			this.suggestions = result.products.reduce(
		// 				(acc, cur) => {
		// 					let max = 0;
		// 					let min = 99999;
		// 					cur.variants.map(item => {
		// 						if (min > item.price)
		// 							min = item.price;
		// 						if (max < item.price)
		// 							max = item.price;
		// 					}, []);

		// 					if (cur.variants.length == 0) {
		// 						min = cur.sale_price
		// 							? cur.sale_price
		// 							: cur.price;
		// 						max = cur.price;
		// 					}
		// 					return [
		// 						...acc,
		// 						{
		// 							...cur,
		// 							minPrice: min,
		// 							maxPrice: max
		// 						}
		// 					];
		// 				},
		// 				[]
		// 			);
		// 		})
		// 	}, 500)
		// } else {
		// 	window.clearTimeout(this.timer);
		// 	this.suggestions = [];
		// }
	}

	matchEmphasize(name: string) {
		var regExp = new RegExp(this.searchTerm, 'i');
		return name.replace(
			regExp,
			match => '<strong>' + match + '</strong>'
		);
	}

	goProductPage() {
		this.searchTerm = '';
		this.suggestions = [];
		var inputElement: any = document.querySelector('.header-search .form-control');
		inputElement.value = "";
		this.closeSearchForm();
	}

	searchToggle(e: Event) {
		document.querySelector('.header-search').classList.toggle('show');
		e.stopPropagation();
	}

	showSearchForm(e: Event) {
		// document
		// 	.querySelector('.header .header-search')
		// 	.classList.add('show');
		document
			.querySelector('.header-search-wrapper')
			.classList.toggle('show');

		e.stopPropagation();
	}

	closeSearchForm() {
		document
			.querySelector('.header .header-search')
			.classList.remove('show');
	}

	submitSearchForm(e: Event) {
		e.preventDefault();
		document
			.querySelector('.header-search-wrapper')
			.classList.remove('show');
		this.router.navigate(['/category'], { queryParams: { keyword: this.searchTerm } });
	}
}
