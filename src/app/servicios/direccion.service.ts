import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}direccion/`;
  }

  porSocioId(socioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}porSocioId/${socioId}`);
  }
}
