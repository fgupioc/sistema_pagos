import {SocioCredito} from '../interfaces/socio-credito';

export class EjecutivoCartera {
  codUsuario: number;
  codCartera: number;
  etapaItems: EjecutivoCarteraEtapa[] = [];
  campoItems: EjecutivoCarteraCampo[] = [];
  sociosOpcional: SocioCredito [] = [];
  codEjecutivoCartera?: number;
  fechaRegistro?: string;
  creditosAsignados?: any[];
  startDate?: string;
  endDate?: string;
}

export class EjecutivoCarteraEtapa {
  codEjecutivoCartera?: number;
  codGestion: number;
  codEtapa: number;
}


export class EjecutivoCarteraCampo {
  codEjecutivoCartera?: number;
  codCampo: string;
  valor?: string;
  desde?: number;
  hasta?: number;
  opciona?: number;
}
