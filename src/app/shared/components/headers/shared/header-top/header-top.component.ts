import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

import { UtilsService } from './../../../../../shared/services/utils.service';
import { ModalService } from './../../../../../shared/services/modal.service';
import { AuthService } from './../../../../../shared/services/auth.service';
import { ApiService } from './../../../../../shared/services/api.service';

@Component({
  selector: 'molla-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
})
export class HeaderTopComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  subscription: any;
  loggedin: boolean = false;
  currentUser: any = [];

  @Input() containerClass = 'container';
  @Input() mobile;
  @Input() contactEmail;

  private subscr: Subscription;

  constructor(
    public router: Router,
    public apiService: ApiService,
    public utilsService: UtilsService,
    public authService: AuthService,
    public modalService: ModalService
  ) {
    this.subscr = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/') {
          document.querySelector('.header')?.classList.add('position-absolute');
        } else {
          document
            .querySelector('.header')
            ?.classList.contains('position-absolute') &&
            document
              .querySelector('.header')
              ?.classList.remove('position-absolute');
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url === '/') {
          document.querySelector('.header')?.classList.add('position-absolute');
        } else {
          document
            .querySelector('.header')
            ?.classList.contains('position-absolute') &&
            document
              .querySelector('.header')
              ?.classList.remove('position-absolute');
        }
      }
    });
  }

  goToOffer(){
    this.router.navigate(['/category', 'offer-35yzh']);
  }

  ngOnInit(): void {
    this.subscription = this.authService.isLogged.subscribe(
      (status: boolean) => {
        if (status) {
          this.loggedin = true;
        } else {
          this.loggedin = false;
        }
      }
    );
    this.getCurrentUser();
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  getCurrentUser() {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = user;
      this.loggedin = true;
    }
  }

  showLoginModal(event: Event): void {
    event.preventDefault();
    this.modalService.showLoginModal();
  }

  logout() {
    this.apiService.logout();
  }
}
