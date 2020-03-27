import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}notificacion/`;
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listar`);
  }

  guardarNotificacionEtapa(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}crear-notificacion-etapa`, data);
  }

  actualizarNotificacionEtapa(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}actualizar-notificacion-etapa`, data);
  }

  getNotificacionesPorEtapa(codEtapa: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}getNotificacionesPorEtapa`, {}, {params: new HttpParams().set('codEtapa', codEtapa)});
  }
}
