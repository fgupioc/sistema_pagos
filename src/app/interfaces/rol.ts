export interface Rol {
  id?: number;
  nombre: string;
  codEstado: string;
  autorizacionesOriginales?: any[];
  autorizacionesModificadas?: any[];
  codArea?: any;
}
