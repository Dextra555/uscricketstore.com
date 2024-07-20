import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../../../../shared/services/auth.service';
import { ApiService } from './../../../../../shared/services/api.service';
import { environment } from './../../../../../../environments/environment';

@Component({
  selector: 'molla-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  SERVER_URL = environment.SERVER_URL;
  currentUser: any;
  subscription;
  userName: any;

  constructor(public authService: AuthService, public apiService: ApiService) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  ngOnInit(): void {
    this.subscription = this.authService.isLogged.subscribe(
      (status: boolean) => {
        if (status) {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        } else {
          this.currentUser = null;
        }
      }
    );
    const name = this.currentUser?.name.split(' ');
    if (name.length === 1) {
      this.userName = name[0].substr(0, 1).charAt(0).toUpperCase().substr(0, 1);
    } else {
      this.userName =
        name[0].substr(0, 1).charAt(0).toUpperCase().substr(0, 1) +
        '' +
        name[1].substr(0, 1).charAt(0).toUpperCase().substr(0, 1) +
        '';
    }
  }
  ngOnDestroy() {}

  logout() {
    // // localStorage.removeItem('currentUser');
    // // localStorage.removeItem('temp_user_id');
    // // localStorage.removeItem('token');

    // // this.apiService.wishChanged(true);
    // // this.apiService.cartChanged(true);
    // this.authService.loginStatus(false);
    this.apiService.logout();
  }
}
