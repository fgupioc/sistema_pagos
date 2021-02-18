export interface EstadosCartera {
  atraso: number,
  cartera: string,
  codCartera: number,
  codMoneda: string,
  dia: number,
  year: number
}

export interface GrupoCartera {
  cartera: string,
  codCartera: number,
  year: number;
  items: EstadosCartera[];
}
