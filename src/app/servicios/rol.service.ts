import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ConfigService} from './seguridad/config.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Rol} from '../interfaces/rol';
import {Respuesta} from '../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  apiUrl: string;
  signinUrl: string;

  constructor(private http: HttpClient, config: ConfigService) {
    this.apiUrl = `${environment.serverUrl}rol/`;
    this.signinUrl = config.config.signinUrl;
  }

  encuentraTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodos`);
  }

  obtenerRol(rolId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtenerRol/${rolId}`);
  }

  autorizaciones(rolId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}autorizaciones/${rolId}`);
  }

  usuarioAutorizaciones(usuarioId: number, rolId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}usuarioAutorizaciones/${usuarioId}/${rolId}`);
  }

  listarActivos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}activos`);
  }

  guardar(rol: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.apiUrl}guardar`, rol);
  }

  actualizar(usuario: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizar`, usuario);
  }

  validarRolUnico(rolId: number, rol: string): Observable<Respuesta> {
    const options = {params: new HttpParams().set('rolId', rolId.toString()).set('rol.ts', rol)};
    return this.http.get<Respuesta>(`${this.apiUrl}validarRolUnico`, options);
  }
}
