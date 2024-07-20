import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'molla-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
})
export class ShippingAddressComponent implements OnInit, OnDestroy {
  changeAddress: any;
  submittingForm = false;
  addresses = [];
  countries = [];
  states = [];
  cities = [];
  formGroup: FormGroup;
  subscription: any;
  subscriptionAddress: any;
  deleteItem: any;
  deletingItem = false;
  currentUser: any;
  constructor(
    public myElement: ElementRef,
    private router: Router,
    public apiService: ApiService,
    public modalService: ModalService,
    private toastrService: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.spinner.start();
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.router.navigate(['/']);
    }
    this.subscription = this.apiService.isDialogConfirmed.subscribe((type) => {
      if (type == 'address') {
        this.deleteConfirmed();
      }
    });
    this.subscriptionAddress = this.apiService.isAddressAdded.subscribe(
      (type) => {
        // if(type=='address'){
        this.getAddresses();
        // }
      }
    );
    this.getAddresses();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionAddress) {
      this.subscriptionAddress.unsubscribe();
    }
  }

  getAddresses() {
    this.apiService.getAddresses().subscribe((result) => {
      if (result.success) {
        //this.toastrService.success(result.message);
        this.addresses = result.data;
        this.spinner.stop();
      }
    });
  }

  defaultShippingAddress($event, item) {
    this.apiService.defaultShipping(item.id).subscribe((result) => {
      if (result.success) {
        this.toastrService.success(result.message);
        this.addresses = result.data;
      }
    });
  }

  deleteAddress($event, item) {
    this.deleteItem = item;
    this.modalService.showConfirmModal(
      'address',
      'You want to delete an address.'
    );
  }

  deleteConfirmed() {
    if (!this.deletingItem) {
      this.deletingItem = true;
      this.apiService.deleteAddress(this.deleteItem.id).subscribe((result) => {
        if (result.success) {
          this.toastrService.success(result.message);
          this.addresses = result.data;
        }

        this.deletingItem = false;
      });
    }
  }

  // defaultBillingAddress($event, item){
  // 	this.apiService.defaultBilling(item.id).subscribe(result => {
  // 		if (result.success) {
  // 			this.toastrService.success(result.message);
  // 			this.addresses = result.data;
  // 		}
  // 	});
  // }

  setChangeAddress($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.modalService.showAddressFormModal('edit', 'Update address', item);
  }

  addAddress($event) {
    this.modalService.showAddressFormModal('add', 'Add address');
  }
}
