import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TipoNotificacion} from '../models/tipo-notificacion';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Respuesta} from '../interfaces/Respuesta';

const baseUrl = environment.serverUrl + 'notificacion/';

@Injectable({
  providedIn: 'root'
})
export class TipoNotificacionService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAll(): Observable<TipoNotificacion[]> {
    return this.http.get<TipoNotificacion[]>(`${baseUrl}listar`);
  }

  created(notify: TipoNotificacion): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${baseUrl}crear`, notify);
  }

  updated(notify: TipoNotificacion): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${baseUrl}actualizar`, notify);
  }

  cambiarEstado(id: string, estado: string): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${baseUrl}cambiarEstado`, {}, {params: new HttpParams().set('id', id).set('estado', estado)});
  }
}
