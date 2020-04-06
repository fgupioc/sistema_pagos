import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}ubigeo/`;
  }

  listarDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarDepartamentos`);
  }

  listarProvincias(codDepartamento: any): Observable<any[]> {
    const options = {params: new HttpParams().set('codDepartamento', codDepartamento)};
    return this.http.get<any[]>(`${this.apiUrl}listarProvincias`, options);
  }

  listarDistritos(codDepartamento: string, codProvincia: string): Observable<any[]> {
    const options = {params: new HttpParams().set('codDepartamento', codDepartamento).set('codProvincia', codProvincia)};
    return this.http.get<any[]>(`${this.apiUrl}listarDistritos`, options);
  }
}
