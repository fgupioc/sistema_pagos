import {SocioCredito} from '../interfaces/socio-credito';
import {Cartera} from '../interfaces/cartera';

export class EjecutivoCartera {
  codUsuario: number;
  cartera: Cartera;
  etapaItems: EjecutivoCarteraEtapa[] = [];
  campoItems: EjecutivoCarteraCampo[] = [];
  sociosOpcional: SocioCredito [] = [];
  codEjecutivoCartera?: number;
  fechaRegistro?: string;
  creditosAsignados?: any[];
  startDate?: string;
  endDate?: string;
  frecuencia: string;
}

export class EjecutivoCarteraEtapa {
  codEjecutivoCartera?: number;
  codGestion: number;
  codEtapa: number;
  nombreEtapa?: string;
  nombreGestion?: string;
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
