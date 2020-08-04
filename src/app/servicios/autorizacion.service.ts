import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './seguridad/config.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  apiUrl: string;
  signinUrl: string;

  constructor(private http: HttpClient, config: ConfigService) {
    this.apiUrl = `${environment.serverUrl}autorizacion/`;
    this.signinUrl = config.config.signinUrl;
  }

  porMenuId(menuId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}porMenuId/${menuId}`);
  }
}
