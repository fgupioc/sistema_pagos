import {GrupoCampo} from './grupo-campo';

export interface Cartera {
  codCartera: number;
  codigo: number;
  compromisoDesde: number;
  compromisoHasta: number;
  diasDeudaSinVencer: number;
  diasGestion: number;
  estado: string;
  fechaActualizacion: string;
  fechaCreacion: string;
  horaFin: number;
  horaInicio: number;
  monedas: Moneda[];
  nombre: string;
  nombreExterno: string;
  userCreate: number;
  userUpdate: number;
  campos: GrupoCampo[];
  gestiones: Gestion[];
  carteraGestions: any[];
}

export interface Moneda {
  codCarteraMoneda: number;
  codCartera: number;
  codMoneda: string;
}

export interface Gestion {
  codCartera: number;
  codGestion: number;
  color: string;
  desde: number;
  estado: string;
  etapas: Etapa[];
  fechaActualizacion: string;
  fechaCreacion: string;
  hasta: number;
  nombre: string;
  userCreate: number;
  userUpdate: number;
}

export interface Etapa {
  codEtapa: number;
  codGestion: number;
  codigo: string;
  color: string;
  desde: number;
  estado: string;
  fechaActualizacion: string;
  fechaCreacion: string;
  hasta: number;
  nombre: string;
  notificacionEtapas: any[];
  userCreate: number;
  userUpdate: number;
}
