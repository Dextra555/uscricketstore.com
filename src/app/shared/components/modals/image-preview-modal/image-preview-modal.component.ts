import { Component, Input, OnInit } from '@angular/core';
import { DownloadImageService } from './../../../../shared/services/download-image.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'molla-image-preview-modal',
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.scss'],
})
export class ImagePreviewModalComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  @Input() data;
  @Input() image;
  id: any;
  selectedImage: any;
  constructor(private downloadImageService: DownloadImageService) {}

  ngOnInit(): void {
    this.id = this.image.id;
    for (let item of this.data) {
      if (this.image.id === item.id) {
        this.selectedImage = item.image;
      }
    }
  }

  closeModal() {
    let modal = document.querySelector('.imagePreview-modal') as HTMLElement;
    if (modal) modal.click();
  }

  nextClick(id: any) {
    this.id = ++id;
    for (let item of this.data) {
      if (item.id === id && id > 8) {
        this.selectedImage = item.image;
      }
    }
  }

  prevClick(id: any) {
    this.id = --id;
    for (let item of this.data) {
      if (item.id === id && id > 8) {
        this.selectedImage = item.image;
      }
    }
  }

  downloadImg(image, url) {
    this.downloadImageService.downloadImage(image, url);
  }
}
