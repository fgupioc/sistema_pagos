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

  getCartera(nombre: string): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${nombre}/cartera`);
  }

  getCarteras(): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/carteras`);
  }

  listarEjecutivos(): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/ejecutivos`);
  }

  buscarEjecutivoByCodUsuario(uuid: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${uuid}/ejecutivo`);
  }

  convertToTreeviewItem(cartera: Cartera): TreeviewItem[] {
    const gestiones: ITreeViewItem[] = [];

    cartera.gestiones.forEach(gestion => {
      const etapas: ITreeViewItem[] = [];
      gestion.etapas.forEach(etapa => {
        etapas.push({
          text: etapa.nombre,
          value: String(etapa.codEtapa),
          checked: false,
        });
      });

      gestiones.push({
        text: gestion.nombre,
        value: String(gestion.codGestion),
        children: etapas,
      });
    });
    const root: ITreeViewItem = {
      text: cartera.nombre,
      value: String(cartera.codCartera),
      children: gestiones,
    };

    const itCategory = new TreeviewItem(root);
    return [itCategory];
  }

  listarCamposByCartera(codCartera: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/${codCartera}/campos`);
  }

  convertCamposToTreeviewItem(items: any[], codCartera: number): TreeviewItem[] {
    const childrens: ITreeViewItem[] = [];
    let campoName: string;
    let codCampo: string;

    items.forEach(i => {
      codCampo = i.codCampo;
      if (i.codCampo != CONST.TABLE_INT_MONTO) {
        childrens.push({
          text: i.descripcion,
          value: i.codGrupCampo,
          checked: false
        });
        campoName = i.codCampo == CONST.TABLE_STR_LISTA_PRODUCTO_ABACO ? 'Tipo Crédito' : 'Sede';
      } else {
        campoName = 'Monto';
        const hasta = i.hasta ? ' a ' + i.hasta : '';
        childrens.push({
          text: i.desde + hasta,
          value: i.codGrupCampo,
          checked: false
        });
      }
    });

    const campos: ITreeViewItem[] = [{
      text: campoName,
      value: codCampo,
      children: childrens
    }];

    const root: ITreeViewItem = {
      text: 'Campos Agrupados',
      value: String(codCartera),
      children: campos,
    };

    const itCategory = new TreeviewItem(root);
    return [itCategory];
  }

  listarCreditosByCarteraAndEjecutivo(codCartera: any, codUsuario: any): Observable<Respuesta> {
    return this.http.get<any>(`${urlBase}/cartera/${codCartera}/ejecutivo/${codUsuario}`);
  }

  listaTipoCreditos(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${urlMaestro}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO)});
  }

  listaSedes(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${urlMaestro}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_SEDE)});
  }

  getAlbums() {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums');
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

  crearAcuerdoPorAsignacionYCredito(asignacionId: any, data: any): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/${asignacionId}/crearAcuerdoPorAsignacionYCredito`, data);
  }

  eliminarAcuerdoPorAsignacionYCredito(acuerdoPagoId: any): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${urlBase}/eliminarAcuerdoPorAsignacionYCredito`, {params: new HttpParams().set('acuerdoPagoId', acuerdoPagoId)});
  }

  buscarCreditoPorNroCredito(nroCredito): Observable<Respuesta> {
    return this.http.post<Respuesta>(`${urlBase}/buscarCreditoPorNroCredito`, {}, {params: new HttpParams().set('nroCredito', nroCredito)});
  }

  obtenerEtapasAsignaciones(codAsignacion): Observable<any[]> {
    return this.http.post<any[]>(`${urlBase}/obtenerEtapasAsignaciones`, {}, {params: new HttpParams().set('codAsignacion', codAsignacion)});
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
    return this.http.get<EjecutivoAsignacion[]>(`${urlBase}/listar-asignacion-tarea-por-ejecutivo`,{params: new HttpParams().set('ejecutivoId', ejecutivoId)});
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
}
