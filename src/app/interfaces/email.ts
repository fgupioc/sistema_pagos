export interface Email {
  personaId: number;
  codTipoNotificacion: number;
  email: string;
  codEstado?: string;
  emailId?: number;
  tipo?: string;
  tipoNotificacion?: string;
  tipoUsoDescripcion?: string;
}
