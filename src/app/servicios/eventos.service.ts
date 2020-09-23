import {EventEmitter, Injectable} from '@angular/core';
import {MyNotification} from '../interfaces/my-notification';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  public leerNotifyEmitter: EventEmitter<any> = new EventEmitter<any>();
}
