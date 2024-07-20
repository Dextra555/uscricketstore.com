import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'elements-buttons-page',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})

export class ButtonsPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	constructor() { }

	ngOnInit(): void {
	}
}
