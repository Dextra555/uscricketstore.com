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
	selector: 'recharge-modal',
	templateUrl: './recharge-modal.component.html',
	styleUrls: ['./recharge-modal.component.scss']
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

export class ReachargeModalComponent implements OnInit {
	formGroup: FormGroup;
	recharging:boolean = false;
	constructor(private apiService: ApiService,private authService: AuthService,private toastrService: ToastrService, public modalService: ModalService) {

	}

	ngOnInit(): void {
		this.initForm();
	}

	closeModal() {
		let modal = document.querySelector('.recharge-modal') as HTMLElement;
		if (modal)
			modal.click();
	}

	initForm(){
	  	this.formGroup = new FormGroup({
	  		rechargeAmount: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
	  	})
	}

	walletRecharge(){
		let userinfo:any;
		userinfo = localStorage.getItem('currentUser');
		if(!userinfo){
			this.modalService.showLoginModal();
			return;
		}
		userinfo = JSON.parse(userinfo);
		if(this.formGroup.valid){
			this.recharging=true;
			let url=environment.Wallet_Pay_URL;

			var form = document.createElement("form");
			// form.target = "view";
			form.method = "POST";
			form.action = url;

			let params = {
				"redirect_to": environment.BASE_URL+"/checkout",
				"amount": 100,
				"payment_method": 'paypal',
				"payment_type": "wallet_payment",
				"user_id": userinfo.id,
				"order_code": null,
				"transactionId": null,
				"receipt": null,
				"card_number": null,
				"cvv": null,
				"expiration_month": null,
				"expiration_year": null
			}

			for (var i in params) {
				if (params.hasOwnProperty(i)) {
				var input = document.createElement('input');
				input.type = 'hidden';
				input.name = i;
				input.value = params[i];
				form.appendChild(input);
				}
			}

			document.body.appendChild(form);
			form.submit();

			this.recharging=false;
		}
	}

}
