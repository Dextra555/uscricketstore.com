import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'pages-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class PageNotFoundComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	constructor(private meta: Meta, @Inject(DOCUMENT) private document: Document) {
	}

	ngOnInit(): void {
    this.setMetaTags();
	}

  setMetaTags() {
    this.meta.removeTag('name="keywords"');
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:image:width"');
    this.meta.removeTag('property="og:image:height"');
    this.meta.updateTag({ property: 'og:url', content: this.document.URL });
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
  }
}
