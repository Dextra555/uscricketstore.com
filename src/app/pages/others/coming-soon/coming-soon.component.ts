import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'pages-coming-soon',
	templateUrl: './coming-soon.component.html',
	styleUrls: ['./coming-soon.component.scss']
})

export class ComingSoonPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	constructor() {

	}

	ngOnInit(): void {
	}
}
