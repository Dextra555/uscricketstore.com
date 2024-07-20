import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'molla-page-header',
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent implements OnInit {

	@Input() containerClass = "container";
	@Input() image = environment.ASSET_PATH+'assets/images/page-header-bg.jpg';
	@Input() subtitle: string;
	@Input() title: string;

	constructor() { }

	ngOnInit(): void {
	}
}
