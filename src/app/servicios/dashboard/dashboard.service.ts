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

  getEstadoLasCarteras(carteraId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}estado-carteras`, {params: new HttpParams().set('carteraId', carteraId)});
  }

  getEvolucionCobranza(): Observable<any> {
    return this.http.get(`${this.apiUrl}evolucion-cobranza`);
  }

  getComportamientoPago(carteraId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}comportamiento-pago`, {params: new HttpParams().set('carteraId', carteraId)});
  }

  getCarteraConAtraso(carteraId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso`, {params: new HttpParams().set('carteraId', carteraId)});
  }

  getCarteraConAtrasoSectorEconomico(carteraId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso-sector-economico`, {params: new HttpParams().set('carteraId', carteraId)});
  }

  getCarteraConAtrasoSectorEconomicoDetalle(carteraId: any, moneda: any, desde: any, hasta: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso-sector-economico/detalle`, {
      params: new HttpParams()
        .set('carteraId', carteraId)
        .set('moneda', moneda)
        .set('desde', desde)
        .set('hasta', hasta)
    });
  }
  getCarteraConAtrasoSectorEconomicoDetalleDivision(carteraId: any, moneda: any, division: any, desde: any, hasta: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso-sector-economico/detalleDivision`, {
      params: new HttpParams()
        .set('carteraId', carteraId)
        .set('division', division)
        .set('moneda', moneda)
        .set('desde', desde)
        .set('hasta', hasta)
    });
  }
  getCarteraConAtrasoSectorEconomicoDetalleDiasAtraso(carteraId: any, moneda: any, sector: any, desde: any, hasta: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso-sector-economico/detalleDiasAtraso`, {
      params: new HttpParams()
        .set('carteraId', carteraId)
        .set('sector', sector)
        .set('moneda', moneda)
        .set('desde', desde)
        .set('hasta', hasta)
    });
  }

  getcarteraConAtrasoSectorEconomicoDetalleSalso(carteraId: any, init: any, fin: any, moneda: any, desde: any, hasta: any): Observable<any> {
    return this.http.get(`${this.apiUrl}cartera-con-atraso-sector-economico/detalleSaldo`, {
      params: new HttpParams()
        .set('carteraId', carteraId)
        .set('saldoInit', init)
        .set('saldoFin', fin)
        .set('moneda', moneda)
        .set('desde', desde)
        .set('hasta', hasta)
    });
  }

  getRecordAtraso(carteraId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}record-de-atraso` , {params: new HttpParams().set('carteraId', carteraId)});
  }

  getContactabilidad(carteraId: any, fecha: any): Observable<any> {
    return this.http.get(`${this.apiUrl}contactabilidad`, {params: new HttpParams().set('carteraId', carteraId).set('fecha', fecha)});
  }

  listarCarteras(): Observable<Cartera[]> {
    return this.http.get<any>(`${this.apiUrl}listar-carteras`);
  }

  getMotivoAtraso(carteraId: any, codMoneda: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}motivo-de-atraso`, {params: new HttpParams().set('carteraId', carteraId).set('codMoneda', codMoneda)});
  }

  listarDetalleCreditosAldia(carteraId: any, moneda: any): Observable<any> {
    return this.http.get(`${this.apiUrl}estado-carteras-creditos-al-dia` , {params: new HttpParams().set('carteraId', carteraId).set('moneda', moneda)});
  }

  listarDetalleCreditosConAtraso(carteraId: any, moneda: any): Observable<any> {
    return this.http.get(`${this.apiUrl}estado-carteras-creditos-con-atraso` , {params: new HttpParams().set('carteraId', carteraId).set('moneda', moneda)});
  }
}
