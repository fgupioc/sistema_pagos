import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

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
}
