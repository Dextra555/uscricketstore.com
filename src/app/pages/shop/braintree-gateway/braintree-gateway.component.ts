import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/shared/services/api.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NetworkErrorService } from 'src/app/shared/services/network-error.service';
import * as braintree from 'braintree-web-drop-in';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'molla-braintree-gateway',
  templateUrl: './braintree-gateway.component.html',
  styleUrls: ['./braintree-gateway.component.scss'],
})
export class BraintreeGatewayComponent implements OnInit {
  assetPath = environment.ASSET_PATH;
  orderDetails: any;
  private clientToken: string;
  enableButton: boolean = false;
  dropinInstance: any;
  nonce: any;
  submit: boolean = false;
  orderSummary: any;
  tokenResponse: any;
  grand_total:number=0

  constructor(
    private http: HttpClient,
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService,
    public activeRoute: ActivatedRoute,
    public networkErrorService: NetworkErrorService,
    private spinner: NgxUiLoaderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.orderDetails = params;
      this.grand_total = params.total;
    });

    this.spinner.start();
    this.apiService.fetchPaymentInfo(this.orderDetails?.order_code).subscribe(
      (od:any) => {
        // console.log("od", od);
        if(od?.data?.grand_total){
          this.grand_total = od.data.grand_total;
          this.createBraintreeBtn();
        }
    });
  }

  ngOnDestroy(): void {
    this.cartService.showHeaderFooter.emit(true);
  }

  createBraintreeBtn(){
    this.apiService.fetchClientToken().subscribe(
      (response) => {
        this.tokenResponse = response.csrfToken;
        this.enableButton = true;
        this.cartService.showHeaderFooter.emit(false);
        this.clientToken = response.clientToken;

        // Create and mount the Drop-in UI
        braintree.create(
          {
            authorization: this.clientToken,
            container: '#dropin-container',
            paymentOptionPriority: ['card', 'paypal', 'googlePay', 'applePay'],
            googlePay: {
              googlePayVersion: 2,
              merchantId: 'BCR2DN4TZLGLFCJW',
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: `${this.grand_total}`,
                currencyCode: 'USD'
              }
            },
            // samsungPay: true, // Enable Samsung Pay
            paypal: {
              flow: 'vault',
            },
            // Apple Pay is available in Safari on iOS version 10+ and macOS version 10.12+.
            // If Apple Pay is not supported by the customer's browser, the options to select Apple Pay will not appear.
            // Ref: https://developer.paypal.com/braintree/docs/guides/drop-in/setup-and-integration/javascript/v3/
            applePay: {
              displayName: 'US Cricket Store',
              paymentRequest: {
                total: {
                  label: 'Total',
                  amount: `${this.grand_total}`,
                },
                countryCode: 'US',
                currencyCode: 'USD',
                supportedNetworks: ['visa', 'masterCard', 'amex', 'jcb', 'discover'],
                merchantCapabilities: ['supports3DS', 'supportsCredit'],
              }
            }
          },
          (dropinErr, dropinInstance) => {
            this.spinner.stop();
            if (dropinErr) {
              console.error(dropinErr);
              return;
            }
            // Use dropinInstance to handle payment submissions
            this.dropinInstance = dropinInstance;
          }
        );
      },
      (error) => {
        this.enableButton = false;
        this.toastrService.error(error.error.message);
        this.spinner.stop();
      }
    );
  }

  submitPayment(): void {
    console.log(this.dropinInstance, 'check instance');

    this.dropinInstance.requestPaymentMethod((error, payload) => {
      console.log(payload, 'check payload');

      if (error) {
        this.toastrService.error(error);
      } else {
        this.nonce = payload.nonce;
        this.submit = true;
      }
    });
  }

  sendPaymentMethodNonce(): void {
    this.spinner.start();
    this.apiService
      .sendPaymentMethod({
        payment_method_nonce: this.nonce,
        order_code: this.orderDetails.order_code,
        product_type: this.orderDetails.product_type,
        cart_id: this.orderDetails.cart_id,
      })
      .subscribe(
        (response) => {
          console.log('response ==>', response);
          if (response.status) {
            this.toastrService.success('Payment successful');
            this.router.navigate(['/order-summary'], {
              queryParams: {
                order_code: this.orderDetails.order_code,
                product_type: this.orderDetails.product_type,
                transaction_id: response.data.transaction.id,
              },
            });
            this.spinner.stop();
          } else {
            this.router.navigate(['/checkout'], { queryParams: { product_type: this.orderDetails.product_type } });
            this.toastrService.error('Payment failed');
            this.spinner.stop();
          }
        },
        (error) => {
          this.router.navigate(['/checkout'], { queryParams: { product_type: this.orderDetails.product_type } });
          console.log('error===>', error.message);
          this.toastrService.error(error.message);
          this.spinner.stop();
        }
      );
  }
}
