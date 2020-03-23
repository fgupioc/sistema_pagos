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
}
