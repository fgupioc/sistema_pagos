import {SocioCredito} from '../interfaces/socio-credito';
import {Cartera} from '../interfaces/cartera';

export class EjecutivoCartera {
  codUsuario?: number;
  frecuencia: string;
  cartera?: Cartera;
  id?: number;
  etapaItems?: EjecutivoCarteraEtapa[] = [];
  campoItems?: EjecutivoCarteraCampo[] = [];
  sociosOpcional?: SocioCredito [] = [];
  codEjecutivoCartera?: number;
  fechaRegistro?: string;
  creditosAsignados?: any[] = [];
  startDate?: string;
  endDate?: string;
  creditosTemp?: [] = [];
  estado?: string;

}

export class EjecutivoCarteraEtapa {
  codEjecutivoCartera?: number;
  codGestion?: number;
  codEtapa?: number;
  nombreEtapa?: string;
  nombreGestion?: string;
  desde?: number;
  hasta?: number;
}


export class EjecutivoCarteraCampo {
  codEjecutivoCartera?: number;
  codCampo: string;
  valor?: string;
  desde?: number;
  hasta?: number;
  opciona?: number;
  nombreCampo?: string;
}
