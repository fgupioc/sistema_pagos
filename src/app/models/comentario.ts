import {Usuario} from '../interfaces/Usuario';

export class Comentario {
  asignacionId: number;
  socioId: number;
  numCredito: string;
  mensaje: string;
  id?: number;
  usuarioId?: number;
  padreId?: number;
  condicion?: string;
  registro?: string;
  actualizacion?: string;
  comentarios?: Comentario[] = [];
  ejecutivo?: any;
  respuesta?: string;
}

