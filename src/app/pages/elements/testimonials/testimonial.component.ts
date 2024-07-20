import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { sliders } from './testimonial-data';

@Component({
	selector: 'elements-testimonial-page',
	templateUrl: './testimonial.component.html',
	styleUrls: ['./testimonial.component.scss']
})

export class TestimonialPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	testSliders = sliders;

	constructor() {
	}

	ngOnInit(): void {
	}
}
