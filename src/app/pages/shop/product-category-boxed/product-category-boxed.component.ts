import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'shop-product-category-boxed',
	templateUrl: './product-category-boxed.component.html',
	styleUrls: ['./product-category-boxed.component.scss']
})

export class ProductCategoryBoxedPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	constructor() {
	}

	ngOnInit(): void {
	}

	toggleSidebar() {
		if (
			document
				.querySelector('body')
				.classList.contains('sidebar-filter-active')
		) {
			document
				.querySelector('body')
				.classList.remove('sidebar-filter-active');
		} else {
			document
				.querySelector('body')
				.classList.add('sidebar-filter-active');
		}
	}

	hideSidebar() {
		document
			.querySelector('body')
			.classList.remove('sidebar-filter-active');
	}
}
