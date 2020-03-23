import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.serverUrl}cartera/`;
  }

  carteraAbaco(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}abaco`);
  }
}
