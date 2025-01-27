import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/classes/product';
import { environment } from '../../../../../../environments/environment';

@Component({
	selector: 'product-info-two',
	templateUrl: './info-two.component.html',
	styleUrls: ['./info-two.component.scss']
})

export class InfoTwoComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	@Input() product: Product;

	constructor() { }

	ngOnInit(): void {
	}

	setRating = (event: any) => {
		event.preventDefault();

		if (event.currentTarget.parentNode.querySelector('.active')) {
			event.currentTarget.parentNode.querySelector('.active').classList.remove('active');
		}

		event.currentTarget.classList.add('active');
	}
}
