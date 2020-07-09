import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {TablaMaestra} from '../../interfaces/tabla-maestra';

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
    return of(data);
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
      {codItem: '0078', descripcion: 'PISCO'},
    ];
    return of(data);
  }
}
