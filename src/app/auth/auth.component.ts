import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MenuService} from '../servicios/sistema/menu.service';
import {TreeviewItem} from 'ngx-treeview';
import {Menu} from '../interfaces/Menu';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  username: Menu[] = [];
  sidebarMinimized: any;
  navItems = [];
  usuarioId = 1;

  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(
    private menuService: MenuService,
    @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element> this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
    this.encuentraTodossNavItemPorUsuario();
  }

  encuentraTodossNavItemPorUsuario() {
    this.menuService.encuentraTodossNavItemPorUsuario(this.usuarioId).subscribe(navItems => this.navItems = navItems);
  }

  logout() {

  }
}
