import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from './../../../../environments/environment';

import { ApiService } from 'src/app/shared/services/api.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'molla-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
	slug = '';
  page:any;

  constructor(
    public activeRoute: ActivatedRoute,
    private title: Title,
    public router: Router,
    public apiService: ApiService,
    private metaService:Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
    ) {
    this.activeRoute.params.subscribe(params => {
			this.slug = params['slug'];
			this.getData();
		});

  }

  getData(): void {

			this.apiService.fetchPage(this.slug).subscribe(result => {
				this.page = result.data;
        if (this.page==null) {
					// this.router.navigate(['/pages/404']);
          this.router.navigate(['']);
				}
        this.addTag()
			},error => {
				// this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
			})
	}

  ngOnInit(): void {
  }

  addTag() {
    this.title.setTitle(this.page?.metaTitle);
    this.metaService.updateTag( { name:'title',content:this.page?.metaTitle});
    this.metaService.updateTag( { name:'description',content:this.page?.meta_description});
    this.metaService.updateTag( { name:'keywords',content:this.page?.keywords});
    this.metaService.updateTag( { name:'og:title',content:this.page?.metaTitle});
    this.metaService.updateTag( { name:'og:url',content:this.page?.keywords});
    this.metaService.updateTag( { name:'og:image',content:this.page?.meta_image});
    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }
 }

}
