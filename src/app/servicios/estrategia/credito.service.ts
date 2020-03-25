import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Respuesta} from '../../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}credito/`;
  }

  cargarManualmente(formData: FormData) {
    return this.http.post<Respuesta>(`${this.apiUrl}cargarManualmente`, formData);
  }
}
