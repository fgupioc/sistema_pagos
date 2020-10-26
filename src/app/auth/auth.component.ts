import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MenuService} from '../servicios/sistema/menu.service';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';
import {Router} from '@angular/router';
import {EventosService} from '../servicios/eventos.service';
import {MyNotification} from '../interfaces/my-notification';
import {NgxSpinnerService} from 'ngx-spinner';

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
    private route: Router,
    private eventosService: EventosService,
    private spinner: NgxSpinnerService,
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
    this.eventosService.leerNotifyEmitter.subscribe(
      res => {
        if (res.tipo == '01' || res.tipo == '03' || res.tipo == '04') {
          this.notifications = [];
          this.misNotificaciones();
        }
      }
    );
  }

  encuentraTodossNavItemPorUsuario() {
    this.spinner.show();
    this.menuService.encuentraTodossNavItemPorUsuario().subscribe(navItems => {
      this.navItems = navItems;
      this.spinner.hide();
    }, error => this.spinner.hide());
  }

  logout() {
    this.authService.logout('Session completed');
  }

  private misNotificaciones() {
    this.authService.misNotificacione().subscribe(res => this.notifications = res);
  }

  getFormart(hora: string) {
    return hora ? hora.slice(0, 5) : '';
  }

  irNotification(noty: MyNotification) {
    if (noty) {
      if (noty.tipo == '01' || noty.tipo == '02') {
        this.route.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${noty.asignacionId}/detalle/${noty.creditoId}/socio`);
      } else if (noty.tipo == '03') {
        this.route.navigateByUrl(`/auth/gestion-administrativa/mis-tareas/${noty.condicion}`);
      } else if (noty.tipo == '04') {
        console.log(this.authService.loggedUser.role);
        if (this.authService.loggedUser.role == 'E') {
          this.route.navigateByUrl(`/auth/gestion-administrativa/mis-tareas/${noty.condicion}`);
        } else {
          this.route.navigateByUrl(`/auth/gestion-administrativa/tareas/${noty.condicion}`);
        }
      }
    }
  }

  getTipo(tipo: string) {
    let type = '';
    switch (tipo) {
      case '01' :
        type = 'Recordatorio:';
        break;
      case '02' :
        type = 'Acuerdo de Pago:';
        break;
      case '03' :
        type = 'Tarea:';
        break;
      case '04' :
        type = 'Comentario:';
        break;
    }
    return type;
  }
}
