 import { NgModule } from '@angular/core';
// import { SharedModule } from './../../../../shared/shared.module';
// import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from './../../../../shared/services/modal.service';
import { ToastrService } from 'ngx-toastr';
import {AuthService} from './../../../../shared/services/auth.service';
import {ApiService} from './../../../../shared/services/api.service';
import { environment } from '../../../../../environments/environment';
// import { AppComponent } from 'src/app/app.component';



@Component({
	selector: 'review-modal',
	templateUrl: './review-modal.component.html',
	styleUrls: ['./review-modal.component.scss']
})

// @NgModule({
//     imports: [
//         BrowserModule,
//         FormsModule,
//         ReactiveFormsModule
//     ],
//     declarations: [
//         AppComponent
//     ],
//     bootstrap: [AppComponent]
// })

export class ReviewModalComponent implements OnInit {
	public product:any;
	formGroup: FormGroup;
	submittingForm:boolean = false;
	currentUser:any;
	selectedRating:any;
	constructor(private apiService: ApiService,private authService: AuthService,private toastrService: ToastrService, public modalService: ModalService) {

	}

	ngOnInit(): void {
		if(localStorage.getItem('currentUser')){
			this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		}
		this.initForm();
	}

	initForm() {
		this.formGroup = new FormGroup({
			rating: new FormControl('', [Validators.required]),
      		comment: new FormControl('', [Validators.required])
		})

	}


	changeRating(val) {
		if(this.selectedRating==val) return;
		this.selectedRating=val;
		this.formGroup.patchValue({
			rating: val,
		});
	}

	get f(){
		return this.formGroup.controls;
	}

	submitReview() {
		if(!localStorage.getItem('currentUser')){
			this.modalService.showLoginModal();
			return;
		}
		if (this.formGroup.valid && !this.formGroup.getError('mismatch')) {
			if (!this.submittingForm) {
				this.submittingForm = true;
				let values=this.formGroup.value;
				values.product_id=this.product.id;
				this.apiService.submitReview(values).subscribe(result => {
				if (result.success) {
					this.toastrService.success(result.message);
					this.closeModal();
					this.formGroup.reset();
				} else {
					this.toastrService.error(result.message);
				}
				this.submittingForm = false;
				})

			}
		} else {
			Object.keys(this.formGroup.controls).forEach(field => { // {1}
				const control = this.formGroup.get(field);           // {2}
				control.markAsTouched({ onlySelf: true });       // {3}
			});
		}
	}

	closeModal() {
		let modal = document.querySelector('.review-modal') as HTMLElement;
		if (modal)
			modal.click();
	}


}
