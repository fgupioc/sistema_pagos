import {Recordatorio} from './recordatorio';

export interface Tarea {
  correo?: boolean;
  descripcion?: string;
  estado?: string;
  etapaActual?: string;
  fechaCreacion?: string;
  fechaRecordatorio?: string;
  fechaVencimiento?: string;
  horaRecordatorio?: string;
  horaVencimiento?: string;
  id?: number;
  nombre?: string;
  notificacion?: boolean;
  notificacionVencimiento?: boolean;
  prioridad?: number;
  tableroTareaId?: number;
  usuarioId?: number;
  recordatorio?: Recordatorio;
}
