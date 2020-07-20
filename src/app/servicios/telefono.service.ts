import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelefonoService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}telefono/`;
  }

  porSocioId(socioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}porSocioId/${socioId}`);
  }

  guardar(phono: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, phono);
  }

  actualizar(phono: any, old: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}`, phono, {params: new HttpParams().set('old', old)});
  }
}
