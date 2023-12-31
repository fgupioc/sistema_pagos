import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}notificacion/`;
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listar`).pipe(
      map(res => res.filter(v => v.estado != '0'))
    );
  }

  guardarNotificacionEtapa(data: any, send: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}crear-notificacion-etapa`, data, {params: new HttpParams().set('send', send)});
  }

  actualizarNotificacionEtapa(data: any, send: any, dia?: any): Observable<any> {
    const day = dia || '';
    return this.http.post<any>(`${this.apiUrl}actualizar-notificacion-etapa`, data, {params: new HttpParams().set('send', send).set('day', day)});
  }

  getNotificacionesPorEtapa(codEtapa: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}getNotificacionesPorEtapa`, {}, {params: new HttpParams().set('codEtapa', codEtapa)});
  }

  buscarNotificacionEtapa(codGestion: string, codEtapa: string, codTipoNotificacion: string, dia: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}buscar-notificacion-etapa`, {}, {
      params: new HttpParams().set('codGestion', codGestion).set('codEtapa', codEtapa).set('codTipoNotificacion', codTipoNotificacion).set('dia', dia)});
  }
}
