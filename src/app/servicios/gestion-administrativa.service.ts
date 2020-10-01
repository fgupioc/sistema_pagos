import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Respuesta} from '../interfaces/Respuesta';
import {EjecutivoAsignacion} from '../interfaces/ejecutivo-asignacion';
import {Tarea} from '../interfaces/tarea';

const urlBase = environment.serverUrl + 'gestion-administrativa';

@Injectable({
  providedIn: 'root'
})

export class GestionAdministrativaService {
  constructor(
    private http: HttpClient
  ) {
  }

  onteberCreditosPorEjecutivo(ejecutivoId: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/onteberCreditosPorEjecutivo`, {params: new HttpParams().set('ejecutivoId', ejecutivoId)});
  }

  listarTableroTareas(): Observable<EjecutivoAsignacion[]> {
    return this.http.get<EjecutivoAsignacion[]>(`${urlBase}/listar-asignacion-tarea`);
  }

  getTableroTareaBySlug(slug: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/buscar-asignacion-tarea`, {params: new HttpParams().set('slug', slug)});
  }

  crearAsignacionTarea(tablero: EjecutivoAsignacion): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-asignacion-tarea`, tablero);
  }

  actualizarAsignacionTarea(tablero: EjecutivoAsignacion): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/actualizar-asignacion-tarea`, tablero);
  }

  crearTarea(tableroId: string, tarea: Tarea): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-tarea`, tarea, {params: new HttpParams().set('tableroId', tableroId)});
  }

  actualizarEtapaTarea(tareaId: string, etapa: string): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-actualizar-etapa`, {}, {params: new HttpParams().set('tareaId', tareaId).set('etapa', etapa)});
  }

  actualizarTarea(tarea: Tarea): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-actualizar`, tarea);
  }
}
