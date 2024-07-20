import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DownloadImageService } from 'src/app/shared/services/download-image.service';
import { environment } from './../../../environments/environment';

declare var $: any;

@Component({
  selector: 'molla-view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss'],
})
export class ViewGalleryComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  galleryData: any;
  contentData: any;
  constructor(
    private http: HttpClient,
    private modalService: ModalService,
    private downloadImageService: DownloadImageService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      $('[data-bs-toggle="tooltip"]').tooltip();
    }, 500);

    this.http.get(this.assetPath+'assets/json/imagesData.json').subscribe((res) => {
      this.galleryData = Object.values(res)[0];
      Object.values(res)[1].forEach((element) => {
        this.contentData = element;
      });
    });
  }

  showPreviewModal(image) {
    this.modalService.showPreviewImageModal(image, this.galleryData);
  }

  downloadImg(image, url) {
    this.downloadImageService.downloadImage(image, url);
  }
}
