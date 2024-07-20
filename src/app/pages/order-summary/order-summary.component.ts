import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CartService } from 'src/app/shared/services/cart.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
declare let gtag: Function;

@Component({
  selector: 'molla-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  orderDetails: any;
  invoiceData: any;
  productData: any;
  orderSummary: any;
  slots: any;
  loggedin: boolean = false;
  allLaneProducts: boolean = true;
  constructor(
    private router: Router,
    private cartService: CartService,
    private apiService: ApiService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.loggedin = true;
    }
    this.cartService.showHeaderFooter.emit(false);
    this.activeRoute.queryParams.subscribe((params) => {
      this.orderDetails = params;
    });
    this.apiService
      .fetchPaymentInfo(this.orderDetails.order_code)
      .subscribe((response) => {
        this.invoiceData = response.data;
        this.invoiceData.orders.forEach((element) => {
          this.orderSummary = element;
          this.productData = element.products.data;
          if(!this.orderDetails?.gtm){
            this.sendGA4Event('purchase');
            this.router.navigate([], {
              relativeTo: this.activeRoute,
              queryParams: {gtm:true},
              queryParamsHandling: 'merge' // Merge with existing query parameters
            });
          }
          this.productData.forEach((item) => {
            if(!item.booked_slots){
              this.allLaneProducts = false;
            }
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.cartService.showHeaderFooter.emit(true);
  }

  printPage() {
    window.print();
  }

  downloadPdf() {
    const content = document.getElementById('content-download');
    if (!content) {
      console.error('Element not found!');
      return;
    }
    html2canvas(content).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(this.orderDetails.order_code);
    });
  }

  sendGA4Event(event_name:string) {
    let items = []; let val = 0;
    console.log("o", this.productData);
    for(let item of this.productData){
      let addons = item.product_addons?.map(function(addon:any) {
        return addon.name;
      }).join(', ');
      let slots = item.booked_slots?.items?.map(function(slot:any) {
        return `${slot.slot_start_time} - ${slot.slot_end_time}`;
      }).join(', ');
      const combinations = JSON.stringify(item.combinations) || "";
      const tempItem = {
        item_id: item.id,
        // item_slug: item.slug,
        item_name: item.name,
        item_type: (item.booked_slots)?'lane':'product',
        // item_category: item.product.product_type,
        quantity: (item.booked_slots)?1:item.quantity,
        price: (item.price + item.tax).toFixed(2),
        total_price: item.total.toFixed(2),
        addons: addons,
        item_combinations: combinations,
        booking_date: item.booked_slots?.booking_date,
        members: (item.booked_slots)?0:item.quantity,
        booked_slots: slots
      };
      val += tempItem.total_price;
      items.push(tempItem);
    }
    // gtag("event", event_name, null);
    gtag("event", event_name, {
      event_name: event_name,
      transaction_id: this.invoiceData?.code,
      currency: "USD",
      tax: this.orderSummary?.tax,
      shipping: this.orderSummary?.shipping_cost,
      coupon: this.orderSummary?.coupon_discount,
      value: this.orderSummary.grand_total,
      items: items
    });
  }
}
