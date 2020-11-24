import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Cartera} from '../../interfaces/cartera';
import {Respuesta} from '../../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}cartera/`;
  }

  activas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}activas`);
  }

  carteraAbaco(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}abaco`);
  }

  getGestiones(codCartera: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtener-gestiones`, {params: new HttpParams().set('codCartera', codCartera)});
  }

  listarCampos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtener-campo-gestiones`);
  }

  crearGestion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}guardar-gestion`, data);
  }

  actualizarGestion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}actualizar-gestion`, data);
  }

  actualizarCartera(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}actualizar`, data);
  }

  listarSocioPorCartera(codCartera: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}listar-socio-cartera`, {params: new HttpParams().set('codCartera', codCartera)});
  }

  getCarteras(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}listar`);
  }

  obtenerCarterasActivas(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}listarActivos`);
  }

  crearCartera(data: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.apiUrl}guardar`, data);
  }

  cambiarEstado(codCartera: string, estado: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}cambiarEstado`, {}, {params: new HttpParams().set('codCartera', codCartera).set('estado', estado)});
  }

  getCarterasActivas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getCarterasActivas`);
  }

  getCarteraByCodCartera(codCartera: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getCarteraByCodCartera`, {params: new HttpParams().set('codCartera', codCartera)});
  }

  getUsuariosGestion(codGestion: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getUsuariosGestion`, {params: new HttpParams().set('codGestion', codGestion)});
  }
}
