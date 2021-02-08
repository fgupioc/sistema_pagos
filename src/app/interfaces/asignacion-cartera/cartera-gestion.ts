import {CarteraEtapa} from './cartera-etapa';

export interface CarteraGestion {
  id: number;
  codCartera: number;
  codGestion: number;
  desde: number;
  hasta: number;
  fechaCreacion: number;
  fechaActualizacion: number;
  userCreate: number;
  userUpdate: number;
  estado?: string;
  etapas: CarteraEtapa[];
  nombre: string;
}
