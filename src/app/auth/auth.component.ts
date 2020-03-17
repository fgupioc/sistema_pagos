import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  username: any;
  sidebarMinimized: any;
  navItems: any;

  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(@Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
    this.navItems = [{
      name: 'Parent',
      url: '',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Child Menu',
          url: '/url-to-child',
          icon: 'icon-flag'
        },
        {
          name: 'Another Child',
          url: '/url-to-another-child',
          icon: 'icon-bulb'
        },
      ]
    }];
  }

  logout() {

  }
}
