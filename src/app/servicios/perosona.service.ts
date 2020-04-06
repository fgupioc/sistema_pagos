import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerosonaService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}persona/`;
  }

  buscarSocioPorId(id: string): Observable<any> {
    const options = {params: new HttpParams().set('id', id)};
    return this.http.post<any[]>(`${this.apiUrl}buscarSocioPorId`, {}, options);
  }
}
