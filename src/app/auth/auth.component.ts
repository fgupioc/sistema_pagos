import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MenuService} from '../servicios/sistema/menu.service';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';

export interface MyNotification {
  hora: string;
  mensaje: string;
  socio: string;
  tipo: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  username: any;
  sidebarMinimized: any;
  navItems = [];
  notifications: MyNotification[] = [];

  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(
    private authService: AutenticacionService,
    private menuService: MenuService,
    @Inject(DOCUMENT) _document?: any
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element> this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    // this.username = this.authService.loggedUser.persona.primerApellido + ' ' + this.authService.loggedUser.persona.segundoApellido;
    this.username = this.authService.loggedUser.alias;
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  ngOnInit() {
    this.encuentraTodossNavItemPorUsuario();
    this.misNotificaciones();
  }

  encuentraTodossNavItemPorUsuario() {
    this.menuService.encuentraTodossNavItemPorUsuario().subscribe(navItems => this.navItems = navItems);
  }

  logout() {
    this.authService.logout('Session completed');
  }

  private misNotificaciones() {
    this.authService.misNotificacione().subscribe(res => this.notifications = res);
  }
}
