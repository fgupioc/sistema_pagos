export class MontoProyectado {
  fecha: string;
  amortizacion: number;
  interes: number;
  desgravamen: number;
  monto: number;

  constructor(data: any = null) {
    this.fecha = data.fecha ? data.fecha : '';
    this.amortizacion = data.amortizacion ? data.amortizacion : 0;
    this.interes = data.interes ? data.interes : 0;
    this.desgravamen = data.desgravamen ? data.desgravamen : 0;
    this.monto = data.monto ? data.monto : 0;
  }
}
