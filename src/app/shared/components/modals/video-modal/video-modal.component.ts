import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'molla-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent implements OnInit {
  @Input() link;
  safeUrl: SafeHtml = '';
  url = '//www.youtube.com/embed/vBPgmASQ1A0?autoplay=1';

  constructor(
    private modalService: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.link + '?autoplay=1'
    );
  }

  closeModal() {
    this.modalService.dismiss();
  }
}
