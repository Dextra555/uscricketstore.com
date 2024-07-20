import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services/api.service';

@Component({
  selector: 'molla-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit {

  constructor(public apiService: ApiService) { }

  ngOnInit(): void {
  }

  logout(){
		this.apiService.logout();
  }

}
