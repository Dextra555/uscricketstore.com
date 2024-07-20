import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
declare let gtag: Function;

@Component({
  selector: 'molla-sale-modal',
  templateUrl: './sale-modal.component.html',
  styleUrls: ['./sale-modal.component.scss'],
})
export class SaleModalComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  constructor(public router: Router) {}

  ngOnInit(): void {}

  closeModal() {
    let modal = document.querySelector('.login-modal') as HTMLElement;
    if (modal) modal.click();
  }

  goToOffer(){
    this.sendGA4Event("select_promotion");
    this.router.navigate(['/category', 'offer-35yzh']);
  }

  sendGA4Event(event_name:string){
    // gtag('event', event_name, null);
    gtag('event', event_name, {
      event_name: event_name,
      promotion_id: "offer-35yzh",
      promotion_name: "Clearance Sale",
      items: []
    });
  }
}
