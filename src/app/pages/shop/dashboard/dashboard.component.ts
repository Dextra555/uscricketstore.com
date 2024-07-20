import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'shop-dashboard-page',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	ngOnInit(): void {
	}

	viewTab($event: Event, prevId: number, nextId: number) {
		$event.preventDefault();
		let nodes = this.el.nativeElement.querySelectorAll(".nav-dashboard .nav-link");
		this.renderer.removeClass(nodes[prevId], 'active');
		this.renderer.addClass(nodes[nextId], 'active');
	}
}
