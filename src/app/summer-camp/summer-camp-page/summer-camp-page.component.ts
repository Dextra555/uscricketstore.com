import { Component, Inject, OnInit, Renderer2,CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { DOCUMENT, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'molla-summer-camp-page',
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    MatTabsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './summer-camp-page.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./summer-camp-page.component.scss'],
  styles: [`
    .custom-header::after {
      content: none;
    }
  `]
})
export class SummerCampPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  u10cection: boolean = false;
  u14cection: boolean = false;
  activeTab: string = 'u10';

  constructor(
    private title: Title,
    private metaService: Meta,
    public router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  showSection10(section: string): void {
    if (section === 'u10') {
      this.u10cection = false;
      this.u14cection = false;
      this.activeTab = 'u10';
    }
  }

  showSection14(section: string): void {
    if (section === 'u14') {
      this.u14cection = true;
      this.u10cection = true;
      this.activeTab = 'u14';
    }
  }

  ngOnInit(): void {
    this.addTag();
  }

  addTag() {
    this.title.setTitle('ACADEMY | US CRICKET STORE | CRICKINGDOM');
    this.metaService.updateTag({ name: 'title', content: 'ACADEMY | US CRICKET STORE | CRICKINGDOM' });
    this.metaService.updateTag({ name: 'description', content: 'LEARN & GET TRAINED FROM THE BEST' });
    this.metaService.updateTag({ property: 'og:title', content: 'ACADEMY | US CRICKET STORE | CRICKINGDOM' });
    this.metaService.updateTag({ property: 'og:description', content: 'LEARN & GET TRAINED FROM THE BEST' });
    this.metaService.updateTag({ property: 'og:image', content: this.assetPath + 'assets/images/academy_ROHIT.png' });
    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }
  }
}
