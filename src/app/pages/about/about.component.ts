import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'molla-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  about: any;
  page: any;
  loaded = false;
  constructor(
    public apiService: ApiService,
    public router: Router,
    private title: Title,
    private modalService: ModalService,
    private metaService: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
    ) {
    this.apiService.fetchPage('about-us').subscribe(result => {
      this.page = result.data;
      if (this.page == null) {
        // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
      }
      this.addTag()
    }, error => {
        // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
    })

    this.apiService.fetchSettingsData('about').subscribe(result => {
      this.about = result.data;
      this.loaded = true;
    })
  }

  ngOnInit(): void {

  }


  showModal(event: Event, link = null) {
    event.preventDefault();
    this.modalService.showVideoModal(link);
  }

  addTag() {
    this.title.setTitle(this.page?.metaTitle);
    this.metaService.updateTag({ name: 'title', content: this.page?.metaTitle });
    this.metaService.updateTag({ name: 'description', content: this.page?.meta_description });
    this.metaService.updateTag({ name: 'keywords', content: this.page?.keywords });
    this.metaService.updateTag({ property: 'og:title', content: this.page?.metaTitle });
    this.metaService.updateTag({ property: 'og:description', content: this.page?.meta_description });
    this.metaService.updateTag({ property: 'og:image', content: this.page?.meta_image });
    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }
  }

}
