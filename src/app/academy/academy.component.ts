import { Component, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { StyleLoaderService } from '../core/store/mdb.service';
import { Router, NavigationEnd } from '@angular/router';

declare var jQuery: any; // Use 'jQuery' instead of '$'

@Component({
  selector: 'molla-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements AfterViewInit, OnInit {
  
  assetPath = environment.ASSET_PATH;
  items = [
    { title: 'School-like Cricket Curriculum', text: 'Endorsed by Rohit Sharma and based on the curriculum followed by BCCI, ECB, Cricket Australia, and Cricket South Africa.' },
    { title: 'Certified Coaches and Well-Defined Curriculum', text: 'An end-to-end academy management platform with certified coaches.' },
    { title: 'Performance Analysis', text: 'Periodic performance analysis through training videos.' },
    { title: 'Recognition', text: 'Rohit Sharma signed certificates or goodies for the academy\'s camps, tournaments, and special events to recognize top talent.' },
    { title: 'Parent Involvement', text: 'Quarterly review and progress report discussions with parents of every student.' },
    { title: 'Special Visits', text: 'Periodic visits by accomplished and reputed cricket players and coaches to conduct special camps and events.' }
  ];
  visibleItems = [];
  currentIndex = 0;
  itemsToShow = 3;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private styleLoader: StyleLoaderService
  ) {}

  ngOnInit(): void {
    this.updateVisibleItems();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.location.reload();
      }
    });
    this.updateItemsToShow();
    this.addMetaTags(); // Assuming you want to add meta tags when the component initializes
  }

  ngAfterViewInit(): void {
    if (jQuery.fn.carousel) {
      jQuery('#carouselMultiItemExample').carousel();
    } else {
      console.error('Bootstrap carousel method not recognized.');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateItemsToShow();
    this.updateVisibleItems();
  }

  updateItemsToShow(): void {
    if (window.innerWidth < 768) {
      this.itemsToShow = 1;
    } else if (window.innerWidth < 992) {
      this.itemsToShow = 2;
    } else {
      this.itemsToShow = 3;
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateVisibleItems();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateVisibleItems();
  }

  updateVisibleItems(): void {
    this.visibleItems = [];
    let start = this.currentIndex;
    for (let i = 0; i < this.itemsToShow; i++) {
      if (start >= this.items.length) {
        start = 0;
      }
      this.visibleItems.push(this.items[start]);
      start++;
    }
  }

  addMetaTags(): void {
    this.titleService.setTitle('ACADEMY | US CRICKET STORE | CRICKINGDOM');
    this.metaService.updateTag({ name: 'title', content: 'ACADEMY | US CRICKET STORE | CRICKINGDOM' });
    this.metaService.updateTag({ name: 'description', content: 'LEARN & GET TRAINED FROM THE BEST' });
    this.metaService.updateTag({ property: 'og:title', content: 'ACADEMY | US CRICKET STORE | CRICKINGDOM' });
    this.metaService.updateTag({ property: 'og:description', content: 'LEARN & GET TRAINED FROM THE BEST' });
    this.metaService.updateTag({ property: 'og:image', content: `${this.assetPath}assets/images/academy_ROHIT.png` });
  }
}
