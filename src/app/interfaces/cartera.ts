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
}

export interface Moneda {
  codCarteraMoneda: number;
  codCartera: number;
  codMoneda: string;
}
