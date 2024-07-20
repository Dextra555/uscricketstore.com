import { NgModule } from '@angular/core';
// import { SharedModule } from './../../../../shared/shared.module';
// import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../../shared/validators/CustomValidators'
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../shared/services/api.service';
import { ModalService } from './../../../../shared/services/modal.service';



@Component({
	selector: 'forgot-password-modal',
	templateUrl: './forgot-password-modal.component.html',
	styleUrls: ['./forgot-password-modal.component.scss']
})

export class ForgotPasswordModalComponent implements OnInit {

	submittingForm = false;
	resettingPass = false;
	formGroup: FormGroup;
	errors= {
		emailError:false,
		codeError:false,
		passError:false,
		confirmPasswordError:false
	}
	codeError = false;
	codesent = false;
	email="";
	code="";
	password="";
	confirmPassword="";

	constructor(private apiService: ApiService, private router: Router, private toastrService: ToastrService, public modalService: ModalService) {

	}

	ngOnInit(): void {
	}

	closeModal() {
		let modal = document.querySelector('.forgotPassword-modal') as HTMLElement;
		if (modal)
			modal.click();
	}


	checkError(type){
		if(type=='email'){
			this.errors.emailError=false;
			if(this.email=='' || ! this.validateEmail(this.email)){
				this.errors.emailError=true;
			}
		}else if(type=='password'){
			this.errors.passError=false;
			if(this.password=='' || this.password.length<8){
				this.errors.passError=true;
			}

		}else if(type=='confirmPassword'){
			this.errors.confirmPasswordError=false;
			if(this.password != this.confirmPassword){
				this.errors.confirmPasswordError=true;
			}

		}else if(type=='code'){
			this.errors.codeError=false;
			if(this.code==''){
				this.errors.codeError=true;
			}
		}
	}

	validateEmail = (email) => {
		return String(email)
		  .toLowerCase()
		  .match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		  );
	  };


	submitForm() {
		this.errors.passError=false
		this.checkError('email');

		if (!this.errors.emailError) {
			if (!this.submittingForm) {
				this.submittingForm = true;
				const formData = new FormData();
				formData.append('code', this.code);
				formData.append('email', this.email);
				formData.append('invalidPhone', 'true');
				formData.append('showInvalidPhone', 'false');

				formData.append('password', this.password);
				formData.append('confirmPassword', this.confirmPassword);
				this.apiService.passwordCreate(formData).subscribe(result => {
					if (result.success) {
						this.codesent = true;
						this.toastrService.success(result.message);
					} else {
						this.toastrService.error(result.message);
					}
					this.submittingForm = false;
				})

			}
		}
	}

	resetPass() {
		this.errors.passError=false

		this.checkError('email');
		this.checkError('password');
		this.checkError('confirmPassword');
		this.checkError('code');
		if (!this.errors.passError && !this.errors.codeError && !this.errors.emailError && !this.errors.confirmPasswordError) {
			if (!this.resettingPass) {
				this.resettingPass = true;
				const formData = new FormData();
				formData.append('code', this.code);
				formData.append('email', this.email);
				formData.append('invalidPhone', 'true');
				formData.append('showInvalidPhone', 'false');

				formData.append('password', this.password);
				formData.append('confirmPassword', this.confirmPassword);
				this.apiService.passwordReset(formData).subscribe(result => {
					if (result.success) {
						this.loginAgain();
						this.toastrService.success(result.message);
					} else {
						this.toastrService.error(result.message);
					}
					this.resettingPass = false;
				})

			}
		}
	}

	loginAgain() {
		this.closeModal();
		setTimeout(() => {
			this.modalService.showLoginModal();
		}, 1000);
	}

}
