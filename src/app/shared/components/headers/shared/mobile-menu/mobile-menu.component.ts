import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
	selector: 'molla-mobile-menu',
	templateUrl: './mobile-menu.component.html',
	styleUrls: ['./mobile-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class MobileMenuComponent implements OnInit, OnDestroy {

	searchTerm = "";
	@Input() header_menu_left:any;
	@Input() header_menu_right:any;
	@Input() social_links:any;
	
	private subscr: Subscription;

	constructor(private router: Router) {
		this.subscr = this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.hideMobileMenu();
			}
		});

		
	}

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		this.subscr.unsubscribe();
	}

	submenuToggle(e) {

		const parent: HTMLElement = e.target.closest('li');
		const submenu: HTMLElement = parent.querySelector('ul');

		if (parent.classList.contains('open')) {
			$(submenu).slideUp(300, function () {
				parent.classList.remove('open');
			});
		}
		else {
			$(submenu).slideDown(300, function () {
				parent.classList.add('open');
			});
		}

		e.preventDefault();
		e.stopPropagation();
	}

	hideMobileMenu() {
		document.querySelector('body').classList.remove('mmenu-active');
		document.querySelector('html').removeAttribute('style');
	}

	searchProducts(event: any) {
		this.searchTerm = event.target.value;
	}

	submitSearchForm(e: any) {
		e.preventDefault();
		//this.searchTerm = e.currentTarget.querySelector('.form-control').value;
		this.router.navigate(['/category'], { queryParams: { keyword: this.searchTerm } });
	}
}
