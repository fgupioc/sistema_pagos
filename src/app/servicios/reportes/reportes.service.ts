import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  bitacoraGestiones(start:any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bitacora-de-gestiones`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  relacionGestionesRealizadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/relacion-gestiones-realizadas`);
  }

  resumenResultadosPorGestor(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen-resultados-por-gestor`);
  }

  datosCarterasNoAsignadas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/datos-carteras-no-asignadas`);
  }

  compromisosPagos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/compromisos-pagos`);
  }

  pagosRealizadosPorDia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pagos-realizados-por-dia`);
  }
}
