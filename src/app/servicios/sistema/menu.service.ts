import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TreeviewItem} from 'ngx-treeview';
import {Observable} from 'rxjs';
import {Menu} from '../../interfaces/Menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}menu/`;
  }

  encuentraTodosArbol(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodosArbol`);
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

}
