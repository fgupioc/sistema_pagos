import {AcuerdoPago} from './acuerdo-pago';

export interface CreditoGestion {
  id?: number;
  asignacionId?: number;
  usuarioId: number;
  creditoId: number;
  tipoGestion: string;
  tipoContacto: string;
  target: string;
  codRespuesta: string;
  comentario: string;
  duracion: number;
  fechaRegistro?: string;
  estado?: string;
  ejecutivoNombre?: string;
  gestionDescripcion?: string;
  contactoDescripcion?: string;
  respuestaDescripcion?: string;
  acuerdosPago?: AcuerdoPago[];
}
