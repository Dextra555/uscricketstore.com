import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
	selector: 'elements-video-banner-page',
	templateUrl: './video-banner.component.html',
	styleUrls: ['./video-banner.component.scss']
})

export class VideoBannerPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
	constructor(private modalService: ModalService) { }

	ngOnInit(): void {
	}

	showModal(event: Event) {
		event.preventDefault();
		this.modalService.showVideoModal();
	}
}
