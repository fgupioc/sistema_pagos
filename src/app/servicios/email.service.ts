import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Email} from '../interfaces/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}email/`;
  }

  porSocioId(socioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}porSocioId/${socioId}`);
  }

  crear(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, email);
  }

  actualizar(email: any): Observable<Email> {
    return this.http.put<Email>(`${this.apiUrl}`, email);
  }
}
