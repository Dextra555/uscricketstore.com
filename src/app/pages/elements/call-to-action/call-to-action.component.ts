import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'elements-call-to-action-page',
	templateUrl: './call-to-action.component.html',
	styleUrls: ['./call-to-action.component.scss']
})

export class CallToActionPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	constructor() { }

	ngOnInit(): void {
	}
}
