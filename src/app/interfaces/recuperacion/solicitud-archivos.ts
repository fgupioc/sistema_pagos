export interface SolicitudArchivos {
  original: Boolean;
  impresion: Boolean;
  laserfich: Boolean;
  id?: number;
  usuarioId?: number;
  uuid?: string;
  solicitudId?: number;
  urlLaserfich?: string;
  urlDisco?: string;
  comentario?: string;
  extension?: string;
  tipo?: string;
  fechaCreacion?: string;
  estado?: string;
  codigoArchivo?: string;
  descripcion?: string;
  archivoDescripcion?: string;
  codigoSolicitud?: string;
  usuarioAlias?: string;
}
