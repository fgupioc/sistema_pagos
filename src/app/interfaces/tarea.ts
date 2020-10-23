import {Recordatorio} from './recordatorio';
import {TareaActividad} from './tarea-actividad';
import {TareaArchivo} from './tarea-archivo';

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
  actividades?: TareaActividad[];
  archivos?: TareaArchivo[];
  checkFechaVencimiento?: boolean;
  checkFechaRecordatorio?: boolean;
  asignacionId?: number;
  socioId?: number;
  creditoId?: number;
  codActividad?: string;
  condicion?: string;
  socio?: any;
}
