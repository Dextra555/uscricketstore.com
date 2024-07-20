import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'molla-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  loadingBookings = false;
  orders = [];
  page = 1;
  totalBookings;
  currentUser: any;
  constructor(
    private router: Router,
    public apiService: ApiService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.spinner.start();
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.router.navigate(['/']);
    }
    this.getBookings(this.page);
  }

  loadmore() {
    this.page = this.page + 1;
    this.getBookings(this.page);
  }

  getBookings(page) {
    if (!this.loadingBookings) {
      this.loadingBookings = true;
      this.apiService.fetchBookings(page).subscribe((result) => {
        this.orders = [...this.orders, ...result.data];
        this.page = result.meta.current_page;
        this.totalBookings = result.meta.total;
        this.loadingBookings = false;
        this.spinner.stop();
      });
    }
  }
}
