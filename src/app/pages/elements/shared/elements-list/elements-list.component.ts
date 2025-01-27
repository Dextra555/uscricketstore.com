import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { ElementItem, elements } from './element-list';

@Component({
	selector: 'elements-list',
	templateUrl: './elements-list.component.html',
	styleUrls: ['./elements-list.component.scss']
})

export class ElementsListComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	items: ElementItem[] = elements;

	constructor() { }

	ngOnInit(): void {
	}
}
