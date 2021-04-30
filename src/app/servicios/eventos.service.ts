import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  public leerNotifyEmitter: EventEmitter<any> = new EventEmitter<any>();

  public enviarNotifyEmitter: EventEmitter<any> = new EventEmitter<any>();
}
