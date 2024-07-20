import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'elements-banners-page',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss']
})

export class BannersPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	constructor() { }

	ngOnInit(): void { }
}
