import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'molla-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, OnDestroy {
  @Input() items: any = [];
  @Input() out_of_stock: number[] = [];
  index: number = 0;

  current = '/';

  private subscr: Subscription;
  parentName: string;
  subParentName: string;
  hidetab: boolean = false;

  constructor(private router: Router) {
    this.subscr = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  removeSelected(childrens, a) {
    if (a == 0) {
      return (childrens[0].selected = 0);
    } else {
      return (childrens[0].selected = 1);
    }
  }

  addSelectedToFirst(childrens, a) {
    return (childrens[0].selected = 0);
  }

  viewAllDemos(event: any) {
    event.preventDefault();
    var list = document.querySelectorAll('.demo-list .hidden');
    for (let i = 0; i < list.length; i++) {
      list[i].classList.add('show');
    }

    event.target.parentElement.classList.add('d-none');
  }

  createLink(caturl, brands, start_price, end_price, attributes) {
    let link = caturl;
    if (brands && brands.length) {
      link += '?brand_ids=' + brands;
    }
    if (start_price && start_price != null) {
      if (link.indexOf('?')) {
        link += '&min_price==' + start_price;
      } else {
        link += '?min_price==' + start_price;
      }
    }
    if (end_price && end_price != null) {
      if (link.indexOf('?')) {
        link += '&max_price==' + end_price;
      } else {
        link += '?max_price==' + end_price;
      }
    }
    if (attributes && attributes != null) {
      if (link.indexOf('?')) {
        link += '&attribute_values==' + attributes;
      } else {
        link += '?attribute_values==' + attributes;
      }
    }
    return link;
  }

  openMenu(name) {
    this.items.forEach((data) => {
      if (data.name === name) {
        this.parentName = data.name;
      } else {
        return;
      }
    });
  }

  openSubMenu(name, index) {
    this.items.forEach((data) => {
      data.children_menus.forEach((item) => {
        if (item.name === name) {
          this.subParentName = item.name;
          this.index = index;
        } else {
          return;
        }
      });
    });
  }

  hideMenu() {
    document.getElementById('megamenu').classList.remove('show');
    this.parentName = '';
    this.subParentName = '';
  }
}
