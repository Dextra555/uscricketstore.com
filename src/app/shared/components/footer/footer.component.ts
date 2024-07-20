import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { ApiService } from './../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'molla-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	@Input() containerClass = "container";
	@Input() isBottomSticky = false;

	footerData:any;

	year: any;

	constructor(public router: Router, public apiService: ApiService) {

		this.apiService.fetchFooterData().subscribe(result => {
			this.footerData = result;
			//this.totalCount = result.totalCount;

			//this.utilsService.scrollToPageContent();
		})

	}

	ngOnInit(): void {
		this.year = (new Date()).getFullYear();
	}
}
