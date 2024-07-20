import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'pages-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginPageComponent implements OnInit {
  assetPath = environment.ASSET_PATH;

	constructor() {

	}

	ngOnInit(): void {
	}
}
