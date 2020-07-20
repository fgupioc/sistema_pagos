export interface Telefono {
  telefonoId?: number;
  personaId?: number;
  tipo: string;
  pais?: string;
  codCiudad?: string;
  numero: string;
  anexo?: string;
  codUso?: string;
  operador?: string;
  codEstado?: string;
  codTipoNotificacion?: number;
  tipoDescripcion?: string;
  tipoNotificacion?: string;
  operadorDescripcion?: string;
}
