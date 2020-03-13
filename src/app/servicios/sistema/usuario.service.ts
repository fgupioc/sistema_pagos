import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}usuario/`;
  }

  encuentraTodos() {
    return this.http.get<any[]>(`${this.apiUrl}encuentraTodos`);
  }
}
