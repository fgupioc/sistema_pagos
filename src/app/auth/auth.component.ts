import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MenuService} from '../servicios/sistema/menu.service';
import {TreeviewItem} from 'ngx-treeview';
import {Menu} from '../interfaces/Menu';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';
import {type} from 'os';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  username: any;
  sidebarMinimized: any;
  navItems = [];

  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(
    private authService: AutenticacionService,
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
    console.log(this.authService.loggedUser);
    // this.username = this.authService.loggedUser.persona.primerApellido + ' ' + this.authService.loggedUser.persona.segundoApellido;
    this.username = this.authService.loggedUser.email;
  }

  ngOnInit() {
    this.encuentraTodossNavItemPorUsuario(this.authService.loggedUser.id);
  }

  encuentraTodossNavItemPorUsuario(usuarioId: number) {
    this.menuService.encuentraTodossNavItemPorUsuario(usuarioId).subscribe(navItems => this.navItems = navItems);
  }

  logout() {
    this.authService.logout('Session completed');
  }
}
