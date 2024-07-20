import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '../../shared/validators/CustomValidators';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'molla-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  submittingForm = false;
  passwordVisibility: { [key: string]: boolean } = {};
  formGroup: FormGroup;
  userinfo: any;
  image: any;
  passError = false;
  currentUser: any;
  samePassError = false;
  nullValidator: boolean = false;
  userName!: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    public commonService: CommonService,
    private authService: AuthService,
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
    this.initForm();
    this.getUserInfo();
  }

  getUserInfo() {
    this.apiService.getUserInfo().subscribe((result) => {
      if (result.success) {
        this.userinfo = result.user;
        this.image = this.userinfo.avatar;
        this.formGroup.patchValue({
          id: this.userinfo.id,
          name: this.userinfo?.name,
          email: this.userinfo?.email,
          phone: this.userinfo?.phone == 'null' ? '' : this.userinfo?.phone,
          oldPassword: '',
          password: '',
          confirmPassword: '',
        });
        this.spinner.stop();
      } else {
        this.userinfo = null;
        this.spinner.stop();
      }
      const name = this.userinfo?.name.split(' ');
      if (name.length === 1) {
        this.userName = name[0]
          .substr(0, 1)
          .charAt(0)
          .toUpperCase()
          .substr(0, 1);
      } else {
        this.userName =
          name[0].substr(0, 1).charAt(0).toUpperCase().substr(0, 1) +
          '' +
          name[1].substr(0, 1).charAt(0).toUpperCase().substr(0, 1) +
          '';
      }
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.formGroup.patchValue({
        avatar: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  get phone() {
    return this.formGroup.get('phone');
  }
  initForm() {
    this.formGroup = new FormGroup(
      {
        id: new FormControl(''),
        name: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[\w\s]+$/),
          Validators.maxLength(20),
        ]),
        email: new FormControl({ value: '', disabled: true }, [
          Validators.required,
          Validators.email,
        ]),
        phone: new FormControl('', [
          Validators.pattern(/^(?!.*0{10}).*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
        oldPassword: new FormControl('', [Validators.minLength(8)]),
        password: new FormControl('', [Validators.minLength(8), Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$'
        )]),
        confirmPassword: new FormControl('', []),
        avatar: new FormControl(''),
      },
      [CustomValidators.MatchValidator('password', 'confirmPassword')]
    );

    this.formGroup.valueChanges.subscribe((selectedValue) => {
      this.passError = false;
      this.samePassError = false;
    });
  }

  getvalue(e) {
    const value = e.target.value;
    this.nullValidator = value == 'null' ? true : false;
  }

  submitForm() {
    this.passError = false;
    this.samePassError = false;

    if (this.formGroup.valid && !this.formGroup.getError('mismatch')) {
      if (
        this.formGroup.get('oldPassword').value == '' &&
        (this.formGroup.get('password').value != '' ||
          this.formGroup.get('confirmPassword').value != '')
      ) {
        this.passError = true;
        return;
      }
      if (!this.submittingForm) {
        this.submittingForm = true;
        const formData = new FormData();
        formData.append('avatar', this.formGroup.get('avatar').value);
        formData.append('name', this.formGroup.get('name').value);
        formData.append('email', this.formGroup.get('email').value);
        formData.append('phone', this.formGroup.get('phone').value);
        formData.append('oldPassword', this.formGroup.get('oldPassword').value);
        formData.append('password', this.formGroup.get('password').value);
        formData.append(
          'confirmPassword',
          this.formGroup.get('confirmPassword').value
        );
        if (
          this.formGroup.value.oldPassword === this.formGroup.value.password
        ) {
          this.samePassError = true;
          this.submittingForm = false;
        } else if (
          this.formGroup.value.oldPassword == '' &&
          this.formGroup.value.password == ''
        ) {
          this.samePassError = false;
        }
        if (
          (this.formGroup.value.oldPassword == '' &&
            this.formGroup.value.password == '') ||
          this.formGroup.value.oldPassword != this.formGroup.value.password
        ) {
          this.submittingForm = true;
          this.apiService.updateUser(formData).subscribe((result) => {
            if (result.success) {
              this.toastrService.success(result.message);
              localStorage.setItem('currentUser', JSON.stringify(result.user));
              localStorage.setItem('temp_user_id', result.user.id.toString());
              this.authService.loginStatus(true);
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

  get passwordMatchError() {
    return (
      this.formGroup.getError('mismatch') &&
      this.formGroup.get('confirmPassword')?.touched
    );
  }

  togglePasswordVisibility(inputId: string): void {
    this.passwordVisibility[inputId] = !this.passwordVisibility[inputId];
  }
}
