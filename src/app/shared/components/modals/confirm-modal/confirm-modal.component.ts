 import { NgModule } from '@angular/core';
// import { SharedModule } from './../../../../shared/shared.module';
// import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import {ApiService} from './../../../../shared/services/api.service';



@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.scss']
})

export class ConfirmModalComponent implements OnInit {
	public confirmMessage:string;
	public type:string;

	constructor (private apiService: ApiService){

	}
	ngOnInit(): void {
	}

	closeModal() {
		let modal = document.querySelector('.confirm-modal') as HTMLElement;
		if (modal)
			modal.click();
	}

	confirmed(type) {
		this.apiService.dialogConfirmed(type);
		this.closeModal();
	}

}
