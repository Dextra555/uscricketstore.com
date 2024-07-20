// import { NgModule } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalService } from './../../../../shared/services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../../shared/services/auth.service';
import { ApiService } from './../../../../shared/services/api.service';
import { environment } from '../../../../../environments/environment';

import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryCode } from './../../../../core/models/common.model';
import { COUNTRY_CODE } from './../../../../core/constants/country-code.constants';
import { CommonService } from './../../../../shared/services/common.service';

declare var $: any;

@Component({
  selector: 'molla-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  @ViewChild('dialCodeControl1', { static: true }) input: ElementRef;
  redirectTo: any = '';
  passwordVisibility: { [key: string]: boolean } = {};
  formGroup: FormGroup;
  formGroup1: FormGroup;
  signingup: boolean = false;
  signingin: boolean = false;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  countryCode: CountryCode[] = COUNTRY_CODE;
  selectedCountry = 'US';
  selectedDialCode: string | undefined = '+1';
  dialCodeControl = new FormControl();
  filteredCountryCodes!: Observable<CountryCode[]>;
  register: boolean = false;
  activeTabId: number = 1;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: ToastrService,
    public modalService: ModalService,
    public commonService: CommonService
  ) {}

  baseUrl() {
    return environment.BASE_URL;
  }

  async ngOnInit(): Promise<void> {;
    this.activeTabId = this.register?2:1;
    await this.initForm();
    this.checkNetworkStatus();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status) => {
        this.networkStatus = status;
      });
  }

  closeModal() {
    let modal = document.querySelector('.login-modal') as HTMLElement;
    if (modal) modal.click();
  }

  async initForm() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
        ),
      ]),
    });

    this.formGroup1 = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      privacy: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
        ),
      ]),
    });

    this.filteredCountryCodes = this.dialCodeControl.valueChanges.pipe(
      startWith<string | CountryCode>(''),
      map((value) => (typeof value === 'string' ? value : value.dialCode)),
      map((country) =>
        country ? this.filterCountry(country) : this.countryCode.slice()
      )
    );

    console.log(this.filteredCountryCodes, 'check filtered countries');
  }

  socialLogin(type) {
    this.redirectTo = type;
    setTimeout(() => {
      $('#social-login-form').submit();
    }, 500);
  }

  loginProcess() {
    if (this.formGroup.valid) {
      this.signingin = true;
      let value = this.formGroup.value;
      value.temp_user_id = localStorage.getItem('temp_user_id');
      if (!this.networkStatus) {
        this.signingin = false;
        this.toastrService.error('Your system is not connected with Internet');
      } else {
        this.authService.login(value).subscribe((result) => {
          if (result.success) {
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            localStorage.setItem('temp_user_id', result.user.id.toString());
            localStorage.setItem('token', result.access_token);

            this.toastrService.success(result.message);
            this.authService.loginStatus(true);
            this.apiService.wishChanged(true);
            this.apiService.cartChanged(true);
            this.modalService.closeLoginModal();
            //alert(result.message);
          } else {
            localStorage.removeItem('temp_user_id');
            this.toastrService.error(result.message);
            this.authService.loginStatus(false);
            this.apiService.wishChanged(true);
          }

          this.signingin = false;
        });
      }
    } else {
      Object.keys(this.formGroup.controls).forEach((field) => {
        const control = this.formGroup.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  registerProcess() {
    if (this.formGroup1.valid) {
      this.signingup = true;
      let value = this.formGroup1.value;
      value.temp_user_id = localStorage.getItem('temp_user_id');
      if (!this.networkStatus) {
        this.signingup = false;
        this.toastrService.error('Your system is not connected with Internet');
      } else {
        this.authService.signup(value).subscribe((result) => {
          if (result.success) {
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            localStorage.setItem('token', result.access_token);
            localStorage.removeItem('temp_user_id');
            //localStorage.setItem('temp_user_id', result.user.id.toString());
            this.toastrService.success(result.message);
            this.authService.loginStatus(true);
            this.apiService.wishChanged(true);
            this.apiService.cartChanged(true);
            this.modalService.closeLoginModal();
          } else {
            this.toastrService.error(result.message);
            this.authService.loginStatus(false);
            this.apiService.wishChanged(true);
          }
          this.signingup = false;
        });
      }
    } else {
      Object.keys(this.formGroup1.controls).forEach((field) => {
        const control = this.formGroup1.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  get email() {
    return this.formGroup.get('email');
  }

  get privacy() {
    return this.formGroup1.get('privacy');
  }

  get password() {
    return this.formGroup.get('password');
  }

  get signup_name() {
    return this.formGroup1.get('name');
  }

  get controls() {
    return this.formGroup1.controls;
  }
  get control() {
    return this.formGroup.controls;
  }
  get signup_phone() {
    return this.formGroup1.get('phone');
  }

  get signup_email() {
    return this.formGroup1.get('email');
  }

  get signup_password() {
    return this.formGroup1.get('password');
  }

  forgotPassword() {
    this.modalService.closeLoginModal();
    setTimeout(() => {
      this.modalService.showForgotPasswordModal();
    }, 1000);
  }

  filterCountry(data: string): CountryCode[] {
    const codeData = this.countryCode.filter(
      (option) =>
        option.dialCode.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const dialCodeData = this.countryCode.filter(
      (option) => option.code.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const result = [...codeData, ...dialCodeData];
    return result;
  }

  displayFn(data?: CountryCode): string {
    return data ? data.dialCode : '+1';
  }

  onChangeCountry(data: CountryCode): void {
    this.selectedCountry = data.code;
    this.selectedDialCode = data.dialCode;
  }

  onBlurChangeCountry(event: any): void {
    this.selectedDialCode = event.target.value;
    this.countryCode.forEach((element) => {
      if (element.dialCode === this.selectedDialCode) {
        this.selectedCountry = element.code;
      }
      if (event.target.value == '' || event.target.value == '+') {
        this.selectedCountry = 'US';
      }
    });
  }

  togglePasswordVisibility(inputId: string): void {
    this.passwordVisibility[inputId] = !this.passwordVisibility[inputId];
  }

}
