import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  validarUsuarioUnico(usuarioId: number, usuario: string): Observable<Respuesta> {
    const options = {params: new HttpParams().set('usuarioId', usuarioId.toString()).set('usuario', usuario)};
    return this.http.get<Respuesta>(`${this.apiUrl}validarUsarioUnico`, options);
  }

  encuentraTodos(): Observable<any[]> {
    // return of([{usuario: 'sdsdsdsd', fechaInicioSesion: 'df', fechaFinSesion: 'df', codTipoUsuario: 'AD'}]);
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodos`);
  }

  obtenerUsuario(usuarioId: number): Observable<any> {
    // return of({usuario: 'sdsd', fechaInicioSesion: new Date(), fechaFinSesion: new Date(), codTipoUsuario: 'AD'});
    return this.http.get<any>(`${this.apiUrl}obtenerUsuario/${usuarioId}`);
  }

  guardar(usuario: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.apiUrl}guardar`, usuario);
  }

  actualizar(usuario: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizar`, usuario);
  }

  actualizarContrasenha(usuario: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizarContrasenha`, usuario);
  }

}
