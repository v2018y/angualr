import { Component, OnInit } from '@angular/core';
import { Store } from 'app/shared/classes/store';

declare var $: any;
export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'ti-panel', class: '' },
    { path: 'bar', title: 'Bar', icon: 'ti-panel', class: '' },
    { path: 'OpenState', title: 'OpenState', icon: 'ti-panel', class: '' },
    { path: 'SalesState', title: 'SalesState', icon: 'ti-panel', class: '' },

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    constructor(private store:Store){}
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    signOut(){
        if (confirm("Are Sure Want To Logout Form This System")) {
            this.store.clearData();
            window.location.reload();
        }
    }
    // isNotMobileMenu() {
    //     // if ($(window).width() > 991) {
    //     //     return false;
    //     // }
    //      return true;

    // }
}
