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

  listaTipoCreditos(): Observable<TablaMaestra[]> {
    const data: TablaMaestra[] = [
      {codItem: '001', descripcion: 'MICRO'},
      {codItem: '002', descripcion: 'PEQUEÑA'},
      {codItem: '003', descripcion: 'CONSUMO'},
      {codItem: '004', descripcion: 'CORPORATIVA'},
      {codItem: '005', descripcion: 'GRANDES'},
      {codItem: '006', descripcion: 'MEDIANAS'},
      {codItem: '007', descripcion: 'HIPOTECARIA'},
    ];
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_INT_LISTA_TIPO_CREDITO)});
  }

  listaSedes(): Observable<TablaMaestra[]> {
    const data: TablaMaestra[] = [
      {codItem: '001', descripcion: 'LIMA'},
      {codItem: '002', descripcion: 'CALLAO'},
      {codItem: '003', descripcion: 'TRUJILLO'},
      {codItem: '004', descripcion: 'CHICLAYO'},
      {codItem: '005', descripcion: 'CAJAMACA'},
      {codItem: '006', descripcion: 'CUZCO'},
      {codItem: '007', descripcion: 'PIURA'},
      {codItem: '008', descripcion: 'PISCO'},
    ];
    return this.http.get<any>(`${this.apiUrl}listarElementosPorCodTable`, {params: new HttpParams().set('codTable', CONST.TABLE_INT_LISTA_SEDE)});
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
}
