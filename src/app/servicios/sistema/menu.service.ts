import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TreeviewItem} from 'ngx-treeview';
import {Observable} from 'rxjs';
import {Menu} from '../../interfaces/Menu';
import {AuthorityService} from '../authority.service';
import {AutenticacionService} from '../seguridad/autenticacion.service';
import {Autorizacion} from '../../comun/autorzacion';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  apiUrl: string;

  constructor(private http: HttpClient, private auth: AutenticacionService) {
    this.apiUrl = `${environment.serverUrl}menu/`;
  }

  encuentraTodosArbol(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodosArbol`);
  }

  encuentraTodosArbolPorId(rolId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}obtenerAutorizacionesPorRol/${rolId}`);
  }

  accesos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}accesos`);
  }


  /*
  encuentraTodosArbolPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodosArbol/${usuarioId}`);
  }

  encuentraTodossNavItemPorUsuario(usuarioId: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}encuentraTodosNavItem/${usuarioId}`);
  }
  */

  encuentraTodosArbolPorUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodosArbol`);
  }

  encuentraTodossNavItemPorUsuario(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}encuentraTodosNavItem`);
  }

  /*
  menuDeEscritorio(usuarioId: number): Observable<CardInfo[]> {
    return this.http.get<CardInfo[]>(`${this.apiUrl}menuDeEscritorio/${usuarioId}`);
  }
  */

  menuDeEscritorio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}menuDeEscritorio`);
  }

  guardar(accesoUDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}guardar`, accesoUDto);
  }

  findMenuByUserEmail(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/findMenuByUserEmail');
  }


  public hasShow(menu: any, submenu: any, auth: any): boolean {
    const $menu = this.auth.getMenus.find(i => i.name == menu);
    if ($menu) {
      const $submenu = $menu.children.find(e => e.name == submenu);
      if ($submenu) {
        const $auht = $submenu.authorizations.find(o => o.auth == auth);
        if ($auht) {
          return true;
        }
      }
    }
    return false;
  }

  hasShowEtapa(auth: string): boolean {
    return  this.hasShow(Autorizacion.ETAPA_MENU, Autorizacion.ETAPA_SUBMENU, auth);
  }

  hasShowNotifyAuto(auth: string): boolean {
    return  this.hasShow(Autorizacion.NOTIFY_AUTO_MENU, Autorizacion.NOTIFY_AUTO_SUBMENU, auth);
  }

  hasShowCartera(auth: string): boolean {
    return  this.hasShow(Autorizacion.CARTERA_MENU, Autorizacion.CARTERA_SUBMENU, auth);
  }

  hasShowAsigCartera(auth: string): boolean {
    return  this.hasShow(Autorizacion.ASI_CAR_MENU, Autorizacion.ASI_CAR_SUBMENU, auth);
  }

  hasShowNotificacion(auth: string): boolean {
    return  this.hasShow(Autorizacion.NOTIFICACION_MENU, Autorizacion.NOTIFICACION_SUBMENU, auth);
  }

  hasShowMisCarteraAsig(auth: string): boolean {
    return  this.hasShow(Autorizacion.CARTERA_ASIG_MENU, Autorizacion.CARTERA_ASIG_SUBMENU, auth);
  }
}
