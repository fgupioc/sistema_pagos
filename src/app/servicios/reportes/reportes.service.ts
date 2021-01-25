import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}reportes/`;
  }

  getUrlReporteBitacoraGestion(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-bitacora-de-gestiones/${start}/${finish}`, {responseType: 'arraybuffer'});
  }

  getUrlRelacionGestionesRealizadas(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-relacion-gestiones-realizadas/${start}/${finish}`, {responseType: 'arraybuffer'});
  }

  bitacoraGestiones(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}bitacora-de-gestiones`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  relacionGestionesRealizadas(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}relacion-gestiones-realizadas`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  resumenResultadosPorGestor(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}resumen-resultados-por-gestor`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  datosCarterasNoAsignadas(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}datos-carteras-no-asignadas`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  compromisosPagos(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}compromisos-pagos`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  pagosRealizadosPorDia(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}pagos-realizados-por-dia`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }


}
