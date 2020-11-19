import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {TablaMaestra} from '../../interfaces/tabla-maestra';
import {Respuesta} from '../../interfaces/Respuesta';
import {CONST} from '../../comun/CONST';

@Injectable({
  providedIn: 'root'
})
export class MaestroService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}maestro/`;
  }

  listarEstadosDeRegistro(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarEstadosDeRegistro`);
  }

  listarTiposDeUsuarios(): Observable<any[]> {
    // return of([{codItem: 'AD', descripcion: 'Administrador'}, {codItem: 'SU', descripcion: 'Supervisor'}]);
    return this.http.get<any[]>(`${this.apiUrl}listarTiposDeUsuarios`);
  }

  listarMondas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarMondas`);
  }

  listarTipoDirecciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoDirecciones`);
  }

  listarTipoViviendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoViviendas`);
  }

  listarTipoVias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoVias`);
  }

  listarTipoSecciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoSecciones`);
  }

  listarTipoZonas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoZonas`);
  }

  listarTipoSectores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoSectores`);
  }

  listarTipoUso(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoUso`);
  }

  listarTipoOperador(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoOperador`);
  }

  listarTipoTelefonos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoTelefonos`);
  }

  listarTipoDocumentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoDocumentos`);
  }

  listarTipoSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoSexo`);
  }

  listarTipoEstadosCivil(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarEstadoCivil`);
  }

  listarElementosPorCodTable(id: string): Observable<TablaMaestra[]> {
    return this.http.get<TablaMaestra[]>(this.apiUrl + 'listarElementosPorCodTable', {params: new HttpParams().set('codTable', id)});
  }

  crear(data: TablaMaestra): Observable<Respuesta> {
    return this.http.post<Respuesta>(this.apiUrl, data);
  }

  actualizar(data: TablaMaestra): Observable<Respuesta> {
    return this.http.put<Respuesta>(this.apiUrl, data);
  }

  cambiarEstado(data: TablaMaestra, state: string): Observable<Respuesta> {
    return this.http.put<Respuesta>(`${this.apiUrl}${data.codTabla}/${data.codItem}`, {}, {params: new HttpParams().set('state', state)});
  }

  listarTipoActividades(): Observable<TablaMaestra[]> {
    /*
    const data: TablaMaestra[] = [
      {codItem: '1', descripcion: 'LLAMADAS'},
      {codItem: '2', descripcion: 'CORREO'},
      {codItem: '3', descripcion: 'MENSAJE'},
      {codItem: '4', descripcion: 'VISITA DOMICILIARIA'},
    ];

    return of(data);
    */
    return this.http.get<TablaMaestra[]>(this.apiUrl + 'listarElementosPorCodTable', {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_ACTIVIDADES)});
  }

  loadEstadosRecordatorios(): Observable<TablaMaestra[]> {
    /*
    const data: TablaMaestra[] = [
      {codItem: '1', descripcion: 'VIGENTE'},
      {codItem: '2', descripcion: 'COMPLETADA'},
      {codItem: '3', descripcion: 'CANCELADA'},
      {codItem: '4', descripcion: 'NO COMPLETADA'},
      {codItem: '5', descripcion: 'NO COMPLETADA'},
    ];

    return of(data);
    */
    return this.http.get<TablaMaestra[]>(this.apiUrl + 'listarElementosPorCodTable', {params: new HttpParams().set('codTable', CONST.TABLE_STR_TABLE_ESTADO_RECORDATORIOS)});
  }

  loadTipoAcuerdos(): Observable<TablaMaestra[]> {
    /*
    const data: TablaMaestra[] = [
      {codItem: '1', descripcion: 'AL DÍA'},
      {codItem: '2', descripcion: 'PLAN DE PAGO'},
      {codItem: '3', descripcion: 'TOTAL DE LA MORA'},
      {codItem: '4', descripcion: 'ABONO'},
    ];

    return of(data);
    */
    return this.http.get<TablaMaestra[]>(this.apiUrl + 'listarElementosPorCodTable', {params: new HttpParams().set('codTable', CONST.TABLE_STR_TABLE_TIPO_ACUERDOS)});
  }

  loadTipoUsoEmail(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarTipoUsoEmail`);
  }


  listaTablaTipoCredito(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_DE_CREDITO_ABACO)});
  }

  listaTablaProductoAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_PRODUCTO_ABACO)});
  }

  listaTablaSedes(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_SEDE)});
  }

  listaTablaBancasAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_BANCA_ABACO)});
  }

  listaTablaDivisionesAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_DIVISION_ABACO)});
  }

  listaTablaComerciosAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_COMERCIAL_ABACO)});
  }

  listaTablaTipoSociosAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_TIPO_DE_SOCIO_ABACO)});
  }

  listaTablaClasificacionDeudorAbaco(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO)});
  }

  listarTiposGestiones(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_GESTIONES)});
  }

  listarTiposContactos(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_ACTIVIDADES)});
  }

  listarTiposRespuestas(): Observable<TablaMaestra[]> {
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_STR_LISTA_RESPUESTAS)});
  }
}
