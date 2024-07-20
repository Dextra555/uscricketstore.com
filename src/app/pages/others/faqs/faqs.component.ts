import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { faqGroups } from './faq-data';

@Component({
	selector: 'pages-faqs-page',
	templateUrl: './faqs.component.html',
	styleUrls: ['./faqs.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class FaqsPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	faqGroups = faqGroups;

	constructor() {
	}

	ngOnInit(): void {
	}
}
