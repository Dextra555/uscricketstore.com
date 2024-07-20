import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { iconBoxes, counters, brands, members } from './about-two-data';

@Component({
	selector: 'pages-about-two-page',
	templateUrl: './about-two.component.html',
	styleUrls: ['./about-two.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AboutTwoPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	iconBoxes = iconBoxes;
	brands = brands;
	members = members;
	counters = counters;

	constructor(public sanitizer: DomSanitizer) {
	}

	ngOnInit(): void {
	}
}
