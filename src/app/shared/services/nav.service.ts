import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	image?: string;
	active?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor() { }

	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			title: 'Categories', type: 'sub', active: false, children: [
				{ path: '/shop/product/three/column/trim-dress', title: 'three-column', type: 'link' },
				{ path: '/shop/product/four/image/belted-dress', title: 'four-image', type: 'link' },
				{ path: '/shop/product/bundle/trim-dress', title: 'bundle-product', type: 'link' },
				{ path: '/shop/product/image/outside/trim-dress', title: 'image-outside', type: 'link' }
			]
		}
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	
}
