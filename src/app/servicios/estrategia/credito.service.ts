import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Respuesta} from '../../interfaces/Respuesta';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}credito/`;
  }

  listarCargas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}listarCargas`);
  }

  cargarManualmente(formData: FormData) {
    return this.http.post<Respuesta>(`${this.apiUrl}cargarManualmente`, formData);
  }

  resetear(): Observable<Respuesta> {
    return this.http.delete<Respuesta>(`${this.apiUrl}resetear`);
  }

  ejecutarCargas() {
    return this.http.post<Respuesta>(`${this.apiUrl}ejecutarCargas`, null);
  }
}
