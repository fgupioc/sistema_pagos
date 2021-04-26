import { SolicitudArchivos } from './solicitud-archivos';

export interface Solicitud {
  mensaje: string;
  codCreditoPrincipal: number;
  codSolicitud?: string;
  socioId?: number;
  socioAlias?: string;
  codCredito?: string;
  id?: number;
  uuid?: string;
  gestorId?: number;
  ejecutivoId?: number;
  tipoSolicitud?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  userCreate?: number;
  userUpdate?: number;
  estado?: string;
  condicion?: string;
  solicitudArchivos: SolicitudArchivos[],
  acontecimientos?: string;
  comentarios?: string;
  nroCredito?: string;
}
