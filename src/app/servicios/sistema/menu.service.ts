import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TreeviewItem} from 'ngx-treeview';
import {Observable} from 'rxjs';

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

  encuentraTodosArbolPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodosArbol/${usuarioId}`);
  }
}
