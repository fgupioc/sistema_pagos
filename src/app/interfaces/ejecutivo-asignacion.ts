import {Tarea} from './tarea';
import {Persona} from './Persona';

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
  ejecutivo?: Persona;
  ejecutivoAlias?: string;
}
