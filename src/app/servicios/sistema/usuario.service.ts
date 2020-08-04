import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Respuesta} from '../../interfaces/Respuesta';
import {Usuario} from '../../interfaces/Usuario';
import {ConfigService} from '../seguridad/config.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrl: string;
  signinUrl: string;

  constructor(private http: HttpClient, config: ConfigService) {
    this.apiUrl = `${environment.serverUrl}usuario/`;
    this.signinUrl = config.config.signinUrl;
  }

  validarUsuarioUnico(usuarioId: number, usuario: string): Observable<Respuesta> {
    const options = {params: new HttpParams().set('usuarioId', usuarioId.toString()).set('usuario', usuario)};
    return this.http.get<Respuesta>(`${this.apiUrl}validarUsarioUnico`, options);
  }

  encuentraTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodos`);
  }

  obtenerUsuario(usuarioId: number): Observable<any> {
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

  findByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl + 'findByEmail', {params: new HttpParams().set('email', email)});
  }

  codigoRestaurarPassword(email: string, from: string): Observable<any> {
    return this.http.post<any>(this.signinUrl + '/codigoRestaurarPassword', new HttpParams().set('email', email).set('from', from));
  }

  verificarCodigoRestauracion(email: string, code: string): Observable<any> {
    return this.http.post<any>(this.signinUrl + '/verificarCodigoRestauracion', new HttpParams().set('email', email).set('code', code));
  }

  cambiarPassword(email: string, code: string, password: string): Observable<any> {
    return this.http.post<any>(this.signinUrl + '/cambiarPassword', new HttpParams().set('email', email).set('code', code).set('password', password));
  }

  buscarParaAgregarAlRol(nombre: string): Observable<Respuesta> {
    const options = {params: new HttpParams().set('nombre', nombre)};
    return this.http.post<Respuesta>(`${this.apiUrl}buscarParaAgregarAlRol`, {}, options);
  }
}
