import { SolicitudDetalle } from "./solicitud-detalle";

export interface Solicitud {
  mensaje: string;
  detalles: SolicitudDetalle[];
  id?: number;
  uuid?: string;
  codSolicitud?: string;
  gestorId?: number;
  ejecutivoId?: number;
  tipoSolicitud?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  userCreate?: number;
  userUpdate?: number;
  estado?: string;
}
