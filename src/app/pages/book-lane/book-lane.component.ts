import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'molla-book-lane',
  templateUrl: './book-lane.component.html',
  styleUrls: ['./book-lane.component.scss']
})
export class BookLaneComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  booklane: any;
  page: any;
  loaded = false;
  constructor(
    public apiService: ApiService,
    public router: Router,
    private metaService: Meta,
    private title: Title,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
    ) {
    this.apiService.fetchPage('book-a-lane').subscribe(result => {
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

    this.apiService.fetchSettingsData('book-a-lane').subscribe(result => {
      this.booklane = result.data;
      this.loaded = true;
    })
  }

  ngOnInit(): void {

  }

  addTag() {
    this.title.setTitle(this.page?.metaTitle);
    this.metaService.updateTag({ name: 'title', content: this.page?.metaTitle });
    this.metaService.updateTag({ name: 'description', content: this.page?.meta_description });
    this.metaService.updateTag({ name: 'keywords', content: this.page?.keywords });
    this.metaService.updateTag({ name: 'og:title', content: this.page?.metaTitle });
    this.metaService.updateTag({ name: 'og:image', content: this.page?.meta_image });
    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }
  }

}
