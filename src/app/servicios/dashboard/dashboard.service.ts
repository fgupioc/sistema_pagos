import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Cartera} from '../../interfaces/cartera';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}dashboard/`;
  }

  getEstadoLasCarteras(): Observable<any> {
    return this.http.get(`${this.apiUrl}estado-carteras`);
  }

  getEvolucionCobranza(): Observable<any> {
    return this.http.get(`${this.apiUrl}evolucion-cobranza`);
  }

  getComportamientoPago(): Observable<any> {
    return this.http.get(`${this.apiUrl}comportamiento-pago`);
  }

  getCarteraConAtraso(): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso`);
  }

  getRecordAtraso(): Observable<any> {
    return this.http.get(`${this.apiUrl}record-de-atraso`);
  }

  getContactabilidad(): Observable<any> {
    return this.http.get(`${this.apiUrl}contactabilidad`);
  }

  listarCarteras(): Observable<Cartera[]> {
    return this.http.get<any>(`${this.apiUrl}/listar-carteras`);
  }

  getMotivoAtraso(carteraId: any, codMoneda: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/motivo-de-atraso`, {params: new HttpParams().set('carteraId', carteraId).set('codMoneda', codMoneda)});
  }
}
