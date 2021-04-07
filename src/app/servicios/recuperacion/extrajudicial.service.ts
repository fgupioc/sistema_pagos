import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../../interfaces/recuperacion/solicitud';

const urlBase = environment.serverUrl + 'extrajudicial';
const urlMaestro = `${environment.serverUrl}maestro/`;

@Injectable({
  providedIn: 'root'
})

export class ExtrajudicialService {
  constructor(
    private http: HttpClient
  ) {
  }

  getCarteras(): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-carteras`);
  }

  registrarSolicitud(solicitud: Solicitud): Observable<any> {
    return this.http.post<any>(`${urlBase}/registrar-solicitud`, solicitud);
  }

  listarsolicitudes(): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-solicitudes`);
  }

  buscarDetalleSolicitud(uuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/detalle-solicitud`, { params: new HttpParams().set('uuid', uuid)});
  }

  buscarInformacionSocio(uuid: any, id: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscar-informacion-socio`, { params: new HttpParams().set('uuid', uuid).set('id', id) });
  }
}
