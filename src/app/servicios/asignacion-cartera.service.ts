import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Respuesta} from '../interfaces/Respuesta';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TreeviewItem} from 'ngx-treeview';
import {Cartera} from '../interfaces/cartera';
import {TablaMaestra} from '../interfaces/tabla-maestra';
import {CONST} from '../comun/CONST';
import {Recordatorio} from '../interfaces/recordatorio';
import {EjecutivoAsignacion} from '../interfaces/ejecutivo-asignacion';
import {Tarea} from '../interfaces/tarea';

const urlBase = environment.serverUrl + 'asignacio-cartera';
const urlMaestro = `${environment.serverUrl}maestro/`;

export interface ITreeViewItem {
  text: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  children?: ITreeViewItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionCarteraService {

  constructor(
    private http: HttpClient
  ) {
  }

  getCarteras(): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/carteras`);
  }

  getCarterasConUltimaEtapaCobranza(): Observable<any[]> {
    return this.http.get<any[]>(`${urlBase}/carterasConUltimaEtapa`);
  }

  listarEjecutivos(): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/ejecutivos`);
  }

  buscarEjecutivoByCodUsuario(uuid: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${uuid}/ejecutivo`);
  }


  listaTipoCreditos(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${urlMaestro}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO)});
  }

  listaSedes(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${urlMaestro}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_SEDE)});
  }

  listarSociosByCartera(codCartera: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/cartera/${codCartera}/listar-socios`);
  }

  buscarCreditosPorFiltro(codCartera: any, campania: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/cartera/${codCartera}/buscarCreditosPorFiltro`, campania);
  }

  asignarCreditosEjecutivo(codUsuario: any, campania: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/${codUsuario}`, campania);
  }

  listaAsignacionCreditoPorEjecutivo(uuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/${uuid}/listaAsignacionCreditoPorEjecutivo`);
  }

  obtenerAsignnacionPorId(asignacioUuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/${asignacioUuid}/obtenerAsignnacionPorId`);
  }

  eliminarCredito(creditoId: any, asignacionId: any): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${urlBase}/eliminarCredito`, {params: new HttpParams().set('creditoId', creditoId).set('asignacionId', asignacionId)});
  }

  agregarCreditosAsignnacionPorId(creditos: any[], asignacionId: any): Observable<any> {
    return this.http.put<any>(`${urlBase}/agregarCreditosAsignnacionPorId`, creditos, {params: new HttpParams().set('asignacionId', asignacionId)});
  }

  buscarSocioByCodUsuario(codUsuario: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${codUsuario}/socio`);
  }

  /********************** RECORDATORIO *******************************************/

  listarRecordatorioPorAsignacionYCredito(asignacionId, ejecutivoId, socioId, creditoId): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/${asignacionId}/listarRecordatorioPorAsignacionYCredito`, {params: new HttpParams().set('ejecutivoId', ejecutivoId).set('socioId', socioId).set('creditoId', creditoId)});
  }

  crearRecordatorioPorAsignacionYCredito(asignacionId: any, data: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/${asignacionId}/crearRecordatorioPorAsignacionYCredito`, data);
  }

  actualizarRecordatorio(data: Recordatorio): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/actualizarRecordatorio`, data);
  }

  /************** ACUERDO DE PAGO **************************************************/


  listarAcuerdosPorAsignacionYCredito(asignacionId, ejecutivoId, socioId, creditoId): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/${asignacionId}/listarAcuerdosPorAsignacionYCredito`, {params: new HttpParams().set('ejecutivoId', ejecutivoId).set('socioId', socioId).set('creditoId', creditoId)});
  }

  eliminarAcuerdoPorAsignacionYCredito(acuerdoPagoId: any): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${urlBase}/eliminarAcuerdoPorAsignacionYCredito`, {params: new HttpParams().set('acuerdoPagoId', acuerdoPagoId)});
  }

  buscarCreditoPorNroCredito(nroCredito): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/buscarCreditoPorNroCredito`, {}, {params: new HttpParams().set('nroCredito', nroCredito)});
  }

  buscarCreditoAsignacionAccion(creditoId, asignacionId): Observable<any> {
    return this.http.post<any>(`${urlBase}/buscar-credito-asignacio-accion`, {}, {params: new HttpParams().set('creditoId', creditoId).set('asignacionId', asignacionId)});
  }

  leerAccionPorTarea(accionId: any): Observable<any> {
    return this.http.put<any>(`${urlBase}/leer-accion-por-id`, {}, {params: new HttpParams().set('accionId', accionId)});
  }

  listarActividadPorTarea(tareaId: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listar-tarea-actividad`, {params: new HttpParams().set('tareaId', tareaId)});
  }

  leerComentariosPorTarea(tareaId: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/leer-comentario-por-tarea`, {}, {params: new HttpParams().set('tareaId', tareaId)});
  }

  listarTableroTareasPorEjecutivo(ejecutivoId): Observable<EjecutivoAsignacion[]> {
    return this.http.get<EjecutivoAsignacion[]>(`${urlBase}/listar-asignacion-tarea-por-ejecutivo`, {params: new HttpParams().set('ejecutivoId', ejecutivoId)});
  }

  crearAsignacionTarea(tablero: EjecutivoAsignacion): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-asignacion-tarea`, tablero);
  }

  crearTarea(tableroId: any, tarea: Tarea): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-tarea`, tarea, {params: new HttpParams().set('tableroId', tableroId)});
  }

  crearTareaComentario(comment: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/crear-tarea-actividad`, comment);
  }

  desactivarTareaComentario(actividadId: any): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${urlBase}/desactivar-tarea-actividad`, {}, {params: new HttpParams().set('actividadId', actividadId)});
  }

  listarEtapasPorCarteraGestion(codGestion: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listarEtapasPorcarteraGestion`, {params: new HttpParams().set('id', codGestion)});
  }

  listarGestionesPorCartera(codCartera: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listarGestionesPorCartera`, {params: new HttpParams().set('codCartera', codCartera)});
  }

  creditosVencidosPorEjecutivo(ejecutivoUuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/creditosVencidosPorEjecutivo`, {params: new HttpParams().set('ejecutivoUuid', ejecutivoUuid)});
  }

  buscarCreditoVencidosPorEjecutivoUuidAndCredito(ejecutivoUuid: any, numCredito: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscarCreditoVencidosPorEjecutivoUuidAndCredito`, {params: new HttpParams().set('ejecutivoUuid', ejecutivoUuid).set('numCredito', numCredito)});
  }

  buscarCreditosVencidosPorEjecutivoId(gestor: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscarCreditosVencidosPorEjecutivoId`, {params: new HttpParams().set('gestor', gestor)});
  }

  buscarCreditoVencidosPorNroCredito(nroCredito: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscarCreditoVencidosPorNroCredito`, {params: new HttpParams().set('numCredito', nroCredito)});
  }

  buscarCreditosVencidosPorCartera(carteraId: any, desde: any, hasta: any): Observable<any> {
    let params = {};
    if (hasta) {
      params = {params: new HttpParams().set('carteraId', carteraId).set('desde', desde).set('hasta', hasta)};
    } else {
      params = {params: new HttpParams().set('carteraId', carteraId).set('desde', desde)};
    }

    return this.http.get<any>(`${urlBase}/buscarCreditosVencidosPorCartera`, params);
  }

  buscarSolicitudPorUuid(solicitudUuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/buscarSolicitudPorUuid`, {params: new HttpParams().set('solicitudUuid', solicitudUuid)});
  }

  consultarComentarios(numCredito: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/consultarComentarios`, {params: new HttpParams().set('numCredito', numCredito)});
  }

  guardarComentario(comentario: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/guardarComentario`, comentario);
  }

  listarCreditoReasignarPorAsignacionUuid(asignacioUuid: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listarCreditoReasignarPorAsignacion/${asignacioUuid}`);
  }

  listarCreditoReasignarPorAsignacionId(id: any): Observable<any> {
    return this.http.get<any>(`${urlBase}/listarCreditoReasignarPorAsignacionId`, {params: new HttpParams().set('id', id)});
  }

  reasignarCreditos(asignacionId: any, campania: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/reasignar-creditos`, campania, {params: new HttpParams().set('asignacionId', asignacionId)});
  }

  devolverCreditoGestorOriginal(ejecutivoUuid: any, asignacionUuid: string): Observable<any> {
    return this.http.post<any>(`${urlBase}/devolverCreditoGestorOriginal`, {}, {params: new HttpParams().set('ejecutivoUuid', ejecutivoUuid).set('asignacionUuid', asignacionUuid)});
  }

  confirmarAcuerdoPago(keyResp: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/confirmarAcuerdoPago`, {}, {params: new HttpParams().set('keyResp', keyResp)});
  }

  cancelarAcuerdoPago(keyResp: any): Observable<any> {
    return this.http.post<any>(`${urlBase}/cancelarAcuerdoPago`, {}, {params: new HttpParams().set('keyResp', keyResp)});
  }
}
