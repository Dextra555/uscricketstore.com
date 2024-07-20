import { NgModule } from '@angular/core';
// import { SharedModule } from './../../../../shared/shared.module';
// import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../shared/services/api.service';
import { CommonService } from './../../../../shared/services/common.service';

@Component({
  selector: 'address-form-modal',
  templateUrl: './address-form-modal.component.html',
  styleUrls: ['./address-form-modal.component.scss'],
})
export class AddressFormModalComponent implements OnInit {
  public title: string;
  public address: any;
  public type: string;
  submittingForm = false;
  countries = [];
  states = [];
  cities = [];
  formGroup: FormGroup;
  nullValidator: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService,
    public commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.getCountries();
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      id: new FormControl(''),
      firstname: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(20),
        ])
      ),
      lastname: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(20),
        ])
      ),
      address: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.required,
          Validators.pattern(/^[\w\s\!@#%^&*()_+-={}|;':",./<>?~`]/),
        ])
      ),
      postal_code: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(12),
          Validators.minLength(4),
        ])
      ),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?!.*0{10}).*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ])
      ),
      default_shipping: new FormControl(1),
      default_billing: new FormControl(1),
    });

    if (this.address) {
      this.formGroup.patchValue({
        id: this.address.id,
        firstname: this.address.firstname,
        lastname: this.address.lastname,
        address: this.address.address,
        postal_code: this.address.postal_code,
        phone: this.address.phone,
        default_shipping: this.address.default_shipping,
        default_billing: this.address.default_billing,
      });

      this.formGroup.patchValue(
        {
          country: parseInt(this.address.country_id),
        },
        { emitEvent: false, onlySelf: true }
      );

      if (this.address && this.address.country_id) {
        this.getStates();
      }
    }
  }

  closeModal() {
    let modal = document.querySelector('.address-modal') as HTMLElement;
    if (modal) modal.click();
  }

  added(type) {
    this.apiService.addressAdded(type);
    this.closeModal();
  }

  getCountries() {
    this.apiService.fetchCountries().subscribe((result) => {
      if (result.success) {
        //this.toastrService.success(result.message);
        this.countries = result.data;
      }
    });
  }

  getvalue(e) {
    const value = e.target.value;
    this.nullValidator = value == 'null' ? true : false;
  }

  getStates() {
    if (this.formGroup.controls['country'].value != '') {
      this.apiService
        .fetchStates(this.formGroup.controls['country'].value)
        .subscribe((result) => {
          if (result.success) {
            //this.toastrService.success(result.message);
            this.states = result.data;
            setTimeout(() => {
              if (this.address && this.address.state_id) {
                this.formGroup.patchValue(
                  {
                    state: parseInt(this.address.state_id),
                  },
                  { emitEvent: false, onlySelf: true }
                );
                this.getCities();
              }
            }, 1000);
          }
        });
    } else {
      this.states = [];
    }
  }

  getCities() {
    if (this.formGroup.controls['state'].value == '') {
      this.cities = [];
    } else {
      this.apiService
        .fetchCities(this.formGroup.controls['state'].value)
        .subscribe((result) => {
          if (result.success) {
            //this.toastrService.success(result.message);
            this.cities = result.data;

            setTimeout(() => {
              if (this.address && this.address.city_id) {
                this.formGroup.patchValue(
                  {
                    city: parseInt(this.address.city_id),
                  },
                  { emitEvent: false, onlySelf: true }
                );
              }
            }, 1000);
          }
        });
    }
  }

  submitForm() {
    if (this.formGroup.valid) {
      if (!this.submittingForm) {
        this.submittingForm = true;
        if (this.address) {
          this.apiService
            .updateAddress(this.formGroup.value)
            .subscribe((result) => {
              if (result.success) {
                this.toastrService.success(result.message);
                this.added('update');
              } else {
                this.toastrService.error(result.message);
              }
              this.submittingForm = false;
            });
        } else {
          this.apiService
            .addAddress(this.formGroup.value)
            .subscribe((result) => {
              if (result.success) {
                this.formGroup.reset();
                this.toastrService.success(result.message);
                this.added('add');
              } else {
                this.toastrService.error(result.message);
              }
              this.submittingForm = false;
            });
        }
      }
    } else {
      Object.keys(this.formGroup.controls).forEach((field) => {
        // {1}
        const control = this.formGroup.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }
}
