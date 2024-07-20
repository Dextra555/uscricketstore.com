import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from './../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'molla-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  contact: any;
  formGroup: FormGroup;
  page: any;
  loaded = false;
  safeUrl: SafeHtml = '';
  submittingForm = false;
  nullValidator: boolean = false;

  constructor(
    public apiService: ApiService,
    private toastrService: ToastrService,
    public router: Router,
    private title: Title,
    private sanitizer: DomSanitizer,
    private metaService: Meta,
    public commonService: CommonService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.apiService.fetchPage('contact-us').subscribe(
      (result) => {
        this.page = result.data;
        if (this.page == null) {
          // this.router.navigate(['/pages/404']);
          this.router.navigate(['']);
        }
        this.addTag();
      },
      (error) => {
        // this.router.navigate(['/pages/404']);
        this.router.navigate(['']);
      }
    );

    this.apiService.fetchSettingsData('contact').subscribe((result) => {
      this.contact = result.data;
      if (this.contact.google_location) {
        // this.safeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(this.product.video_link+'?autoplay=1');
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.contact.google_location
        );
      }
      this.loaded = true;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?!.*0{10}).*$/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

  getvalue(e) {
    const value = e.target.value;
    this.nullValidator = value == 'null' ? true : false;
  }

  submitForm() {
    if (this.formGroup.valid) {
      if (!this.submittingForm) {
        this.submittingForm = true;
        this.apiService.contactUs(this.formGroup.value).subscribe((result) => {
          if (result.success) {
            this.formGroup.reset();
            this.toastrService.success(result.message);
          } else {
            this.toastrService.error(result.message);
          }
          this.submittingForm = false;
        });
      }
    } else {
      Object.keys(this.formGroup.controls).forEach((field) => {
        // {1}
        const control = this.formGroup.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  addTag() {
    this.title.setTitle(this.page?.metaTitle);
    this.metaService.updateTag({
      name: 'title',
      content: this.page?.metaTitle,
    });
    this.metaService.updateTag({
      name: 'description',
      content: this.page?.meta_description,
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: this.page?.keywords,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: this.page?.metaTitle,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: this.page?.meta_image,
    });
    this.metaService.updateTag({ property: 'og:description', content: this.page?.meta_description });
    const existingCanonicalElement = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonicalElement) {
      this.renderer.setAttribute(existingCanonicalElement, 'href', `${environment.BASE_URL}${this.router.url}`);
    }
  }
}
