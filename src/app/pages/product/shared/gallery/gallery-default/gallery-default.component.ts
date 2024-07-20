import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { Product } from 'src/app/shared/classes/product';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'product-gallery-default',
	templateUrl: './gallery-default.component.html',
	styleUrls: ['./gallery-default.component.scss']
})

export class GalleryDefaultComponent implements OnInit {

	@Input() product;
	@Input() adClass = 'product-gallery-vertical';

	paddingTop = '100%';
	currentIndex = 0;
	album = [];
	lightBoxOption = {
		showImageNumberLabel: true,
		centerVertically: true,
		showZoom: true,
		fadeDuration: .2,
		albumLabel: "%1 / %2"
	}

	SERVER_URL = environment.SERVER_URL;

	constructor(public lightBox: Lightbox,private sanitizer: DomSanitizer) { }

	@HostListener('window:resize', ['$event'])
	closeLightBox(event: Event) {
		this.lightBox.close();
	}

	ngOnChanges() {
		this.album = [];

		for (let i = 0; i < this.product.photos.length; i++) {
			
			let src =  this.sanitizer.bypassSecurityTrustResourceUrl(this.product.photos[i]);
			this.album.push({
				src: src,
				thumb: src,
				caption: this.product.name
			});
		}

		//console.log(this.album)
	}

	ngOnInit(): void {
		
		this.paddingTop = Math.floor((parseFloat('500') / parseFloat('400') * 1000)) / 10 + '%';

	}

	changeImage($event: Event, index = 0) {
		this.currentIndex = index;
		$event.preventDefault();
	}

	openLightBox() {
		this.lightBox.open(this.album, this.currentIndex, this.lightBoxOption);
	}
}