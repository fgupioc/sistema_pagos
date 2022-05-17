import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MenuService} from '../servicios/sistema/menu.service';
import {AutenticacionService} from '../servicios/seguridad/autenticacion.service';
import {Router} from '@angular/router';
import {EventosService} from '../servicios/eventos.service';
import {MyNotification} from '../interfaces/my-notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {INavData} from '@coreui/angular/lib/sidebar/app-sidebar-nav';

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
        if (res.tipo == '01' || res.tipo == '03' || res.tipo == '04' || res.tipo == '05') {
          this.notifications = [];
          this.misNotificaciones();
        }
      }
    );
  }

  encuentraTodossNavItemPorUsuario() {
    this.spinner.show();
    // this.menuService.encuentraTodossNavItemPorUsuario().subscribe(navItems => {
    //   this.navItems = navItems.filter(i => i.children.length > 0 );
    //   this.spinner.hide();
    // }, error => this.spinner.hide());
    console.log(this.authService.loggedUser.email);
    this.menuService.findMenuByUserEmail().subscribe(
      res => {
        this.navItems = res;
        this.authService.setMenu(res);
        setTimeout(() => this.loadMenu(), 1);
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
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
        this.route.navigateByUrl(`/auth/estrategia/asignacion-cartera/mis-cartera-asignadas/${noty.asignacionUuid}/detalle/${noty.nroCredito}/socio`);
      } else if (noty.tipo == '03') {
        this.route.navigateByUrl(`/auth/gestion-administrativa/mis-tareas/${noty.condicion}`);
      } else if (noty.tipo == '04') {
        console.log(this.authService.loggedUser.role);
        if (this.authService.loggedUser.role == 'E') {
          this.route.navigateByUrl(`/auth/gestion-administrativa/mis-tareas/${noty.condicion}`);
        } else {
          this.route.navigateByUrl(`/auth/gestion-administrativa/tareas/${noty.condicion}`);
        }
      } else if (noty.tipo == '05' || noty.tipo == '06') {
        this.route.navigateByUrl(`/auth/gestion-administrativa/mis-gestiones/${noty.nroCredito}/detalle`);
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
      case '05' :
        type = 'Respuesta:';
        break;
      case '06' :
        type = 'Pago de Cuota:';
        break;
    }
    return type;
  }

  loadMenu() {
    $('.nav-item.nav-dropdown').removeClass('open');
  }
}
