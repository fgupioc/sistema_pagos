import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Respuesta} from '../interfaces/Respuesta';

const urlBase = environment.serverUrl + 'gestion-administrativa';

@Injectable({
  providedIn: 'root'
})

export class GestionAdministrativaService {
  constructor(
    private http: HttpClient
  ) {
  }

  onteberCreditosPorEjecutivo(ejecutivoId: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(`${urlBase}/onteberCreditosPorEjecutivo`, {params: new HttpParams().set('ejecutivoId', ejecutivoId)});
  }
}
