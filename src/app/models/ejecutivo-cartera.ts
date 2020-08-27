export class EjecutivoCartera {
  codUsuario: number;
  codCartera: number;
  etapaItems: EjecutivoCarteraEtapa[] = [];
  campoItems: EjecutivoCarteraCampo[] = [];
  codEjecutivoCartera?: number;
  fechaRegistro?: string;
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
