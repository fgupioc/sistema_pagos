import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Respuesta} from '../../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class GestionService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}gestiones/`;
  }

  listarActivos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}listar-activos`);
  }

  listar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}listar`);
  }

  buscarPorCodigo(id: any): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${this.apiUrl}buscar-por-codigo`, {params: new HttpParams().set('id', id)});
  }

  actualizarGestion(gestion: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizar-gestion`, gestion);
  }

  crearGestion(gestion: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${this.apiUrl}crear-gestion`, gestion);
  }

  actualizarEstadoGestion(id: any, estado: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}actualizar-estado-gestion`, {}, {params: new HttpParams().set('id', id).set('estado', estado)});
  }
}
