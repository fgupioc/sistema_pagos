import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CompromisoDePago} from '../../models/reportes/compromiso-de-pago';
import {map} from 'rxjs/operators';

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

  generarExcelResumenResultadosPorGestor(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-resumen-resultados-por-gestor/${start}/${finish}`, {responseType: 'arraybuffer'});
  }

  generarExcelDetalleCarteraNoAsignada(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-detalle-cartera-no-asignada/${start}/${finish}`, {responseType: 'arraybuffer'});
  }


  generarExcelResumenResultadoPorFechaVecimiento(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-resumen-de-resultado-por-fecha-vencimiento/${start}/${finish}`, {responseType: 'arraybuffer'});
  }

  generarExcelCompromisoDePago(start: any, finish: any): Observable<any> {
    return this.http.get(`${this.apiUrl}exportar-compromisos-de-pagos/${start}/${finish}`, {responseType: 'arraybuffer'});
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

  datosResumenResultadoPorFechaVecimiento(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}resumen-de-resultado-por-fecha-vencimiento`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }

  compromisosPagos(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}compromisos-de-pagos`, {params: new HttpParams().set('start', start).set('finish', finish)})
      .pipe(map(res => {
        let itemsSsole: CompromisoDePago[] = [];
        let itemsDolares: CompromisoDePago[] = [];
        if (res.itemsSoles) {
          itemsSsole = res.itemsSoles.map(item => new CompromisoDePago(item));
        }
        if (res.itemsDolares) {
          itemsDolares = res.itemsDolares.map(item => new CompromisoDePago(item));
        }
        res.itemsSoles = itemsSsole;
        res.itemsDolares = itemsDolares;
        return res;
      }));
  }

  pagosRealizadosPorDia(start: any, finish: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}pagos-realizados-por-dia`, {params: new HttpParams().set('start', start).set('finish', finish)});
  }


}
