import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Respuesta} from '../../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}usuario/`;
  }

  encuentraTodos(): Observable<any[]> {
    // return of([{usuario: 'sdsdsdsd', fechaInicioSesion: 'df', fechaFinSesion: 'df', codTipoUsuario: 'AD'}]);
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodos`);
  }

  obtenerUsuario(usuarioId: number): Observable<any> {
    // return of({usuario: 'sdsd', fechaInicioSesion: new Date(), fechaFinSesion: new Date(), codTipoUsuario: 'AD'});
    return this.http.get<any>(`${this.apiUrl}obtenerUsuario/${usuarioId}`);
  }

  actualizar(usuario: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizar`, usuario);
  }
}
