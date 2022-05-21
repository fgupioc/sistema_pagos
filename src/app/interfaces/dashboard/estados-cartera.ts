export interface EstadosCartera {
  monto: number;
  cartera: string;
  codCartera: number;
  codMoneda: string;
  dia: number;
  year: number;
  condicion: string;
}

export interface GrupoCartera {
  cartera: string;
  codCartera: number;
  year: number;
  items: EstadosCartera[];
}
