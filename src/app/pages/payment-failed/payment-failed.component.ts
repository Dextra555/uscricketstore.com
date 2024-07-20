import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'molla-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.scss'],
})
export class PaymentFailedComponent implements OnInit {
  currentUser: any;
  orderid = '';
  constructor(private activeRoute: ActivatedRoute, private router: Router) {
    activeRoute.params.subscribe((params) => {
      this.orderid = params['id'];
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(this.currentUser);
    }
  }
}
