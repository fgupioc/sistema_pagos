import {Tarea} from './tarea';

export interface EjecutivoAsignacion {
  ejecutivoId: number;
  nombre: string;
  visibilidad: string;
  slug: string;
  id?: number;
  usuarioId?: number;
  fechaCreacion?: string;
  estado?: string;
  tareas?: Tarea[];
}
