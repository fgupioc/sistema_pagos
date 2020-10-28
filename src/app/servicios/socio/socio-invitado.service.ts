import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

const apiUrl = `${environment.serverUrl}socio-invitado/`;

@Injectable({
  providedIn: 'root'
})
export class SocioInvitadoService {

  constructor(private http: HttpClient) {
  }

  misCreditos(token: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}mis-creditos`, {}, {params: new HttpParams().set('token', token)});
  }

  obtenerCredito(token: string, numCredito: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}obtener-credito`, {}, {params: new HttpParams().set('token', token).set('numCredito', numCredito)});
  }

  guardarAccion(token: string, numCredito: string, accion: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}guardar-accion`, accion, {params: new HttpParams().set('token', token).set('numCredito', numCredito)});
  }
}
