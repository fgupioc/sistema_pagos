import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
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

  listarTableroEjecutivoTareas(): Observable<EjecutivoAsignacion[]> {
    return this.http.get<EjecutivoAsignacion[]>(`${urlBase}/listar-asignacion-tarea-ejecutivo`);
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

  crearTarea(tableroId: any, tarea: Tarea): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-tarea`, tarea, {params: new HttpParams().set('tableroId', tableroId)});
  }

  cancelarTarea(tareaId: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/cancelar-tarea`, {}, {params: new HttpParams().set('tareaId', tareaId)});
  }

  actualizarEtapaTarea(tareaId: string, etapa: string): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-actualizar-etapa`, {}, {params: new HttpParams().set('tareaId', tareaId).set('etapa', etapa)});
  }

  actualizarTarea(tarea: Tarea): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-actualizar`, tarea);
  }

  actualizarTareaCondicion(tareaId, condicion, comentario, tipoGestion, target, codRespuesta, duracion): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-actualizar-condicion`, {}, {params: new
      HttpParams().set('tareaId', tareaId).set('condicion', condicion).set('comentario', comentario)
        .set('tipoGestion', tipoGestion).set('target', target).set('codRespuesta', codRespuesta).set('duracion', duracion)
    });
  }


  listarActividadPorTarea(tareaId: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-tarea-actividad`, {params: new HttpParams().set('tareaId', tareaId)});
  }

  crearTareaComentario(comment: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-tarea-actividad`, comment);
  }

  actualizarTareaComentario(comment: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/actualizar-tarea-actividad`, comment);
  }

  desactivarTareaComentario(actividadId: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/desactivar-tarea-actividad`, {}, {params: new HttpParams().set('actividadId', actividadId)});
  }

  subirArchivosTarea(archivo: any, tareaId: any, extension: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('tareaId', tareaId);
    formData.append('extension', extension);
    const req = new HttpRequest('POST', `${urlBase}/subir-tarea-archivo`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  listarTareaAchivos(tareaId: any): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/listar-tarea-archivo`, {params: new HttpParams().set('tareaId', tareaId)});
  }

  eliminarTareaAchivos(tareaId: any, archivoid: any): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${urlBase}/eliminar-tarea-archivo`, {params: new HttpParams().set('taskId', tareaId).set('archivoid', archivoid)});
  }

  listarTableroTareasPorEjecutivo(): Observable<EjecutivoAsignacion[]> {
    return this.http.get<EjecutivoAsignacion[]>(`${urlBase}/listar-asignacion-tarea-por-ejecutivo`);
  }

  listarCreditosAsignadosPorEjecutivo(): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/listar-creditos-asignados-por-ejecutivo`);
  }

  buscarCreditoPorNroCredito(nroCredito): Observable<any> {
    return this.http.post<any>(`${urlBase}/buscarCreditoPorNroCredito`, {}, {params: new HttpParams().set('nroCredito', nroCredito)});
  }

  buscarCreditoAsignacionAccion(creditoId, asignacionId): Observable<any> {
    return this.http.post<any>(`${urlBase}/buscar-credito-asignacio-accion`, {}, {params: new HttpParams().set('creditoId', creditoId).set('asignacionId', asignacionId)});
  }

  registrarCreditoAsignacionAccion(asignacion): Observable<any> {
    return this.http.post<any>(`${urlBase}/registrar-accion-credito`, asignacion);
  }

  guardarEnvioEmail(correo: any, asunto: string, url?: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/envio-correo-gestion`, correo, {params: new HttpParams().set('asunto', asunto).set('url', url)});
  }

  iniciarTarea(tareaId): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/tarea-iniciar-proceso`, {}, {params: new HttpParams().set('tareaId', tareaId)});
  }

  leerComentariosPorTarea(tareaId: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/leer-comentario-por-tarea`, {}, {params: new HttpParams().set('tareaId', tareaId)});
  }

  leerAccionPorTarea(accionId: any): Observable<any> {
    return this.http.put<any>(`${urlBase}/leer-accion-por-id`, {}, {params: new HttpParams().set('accionId', accionId)});
  }

  guardarEnvioWhatsapp(data: any, url?: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/envio-whatsapp-gestion`, data, {params: new HttpParams().set('url', url)});
  }

  onteberCreditosDeAsignacionesActivasPorEjecutivo(ejecutivoId: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/onteberCreditosDeAsignacionesActivasPorEjecutivo`, {params: new HttpParams().set('ejecutivoId', ejecutivoId)});
  }

  onteberCreditosDeAsignacionesPorEjecutivo(ejecutivoId: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/onteberCreditosDeAsignacionesPorEjecutivo`, {params: new HttpParams().set('ejecutivoId', ejecutivoId)});
  }

  generarCronograma(monto: any, plazo: any, moneda: any, proceso: any, desembolso: any) {
    return this.http.post<any>(`${urlBase}generarCronograma`, {}, {params: new HttpParams()
        .set('monto', monto)
        .set('plazo', plazo)
        .set('moneda', moneda)
        .set('proceso', proceso)
        .set('desembolso', desembolso)
    });
  }

  tieneAcuerdosPagoPendientesPorSocioId(socioId: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/tieneAcuerdosPagoPendientesPorSocioId`, {params: new HttpParams().set('socioId', socioId)});
  }
}
