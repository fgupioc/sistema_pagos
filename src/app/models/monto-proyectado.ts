export class MontoProyectado {
  amortizacion: number;
  aportaciones: number;
  gastoBancario: number;
  interesCobradoAnticipado: number;
  interesMoraFlat: number;
  interesPrestamoSaldo: number;
  portes: number;
  saldoFecha: number;
  seguroDesgravamen: number;
  seguroIncendios: number;
  seguroVehicular: number;
  montoCuotaProxima: number;

  constructor(data: any = null) {
    this.amortizacion = data.amortizacion ? data.amortizacion : 0;
    this.aportaciones = data.aportaciones ? data.aportaciones : 0;
    this.gastoBancario = data.gastoBancario ? data.gastoBancario : 0;
    this.interesCobradoAnticipado = data.interesCobradoAnticipado ? data.interesCobradoAnticipado : 0;
    this.interesMoraFlat = data.interesMoraFlat ? data.interesMoraFlat : 0;
    this.interesPrestamoSaldo = data.interesPrestamoSaldo ? data.interesPrestamoSaldo : 0;
    this.portes = data.portes ? data.portes : 0;
    this.saldoFecha = data.saldoFecha ? data.saldoFecha : 0;
    this.seguroDesgravamen = data.seguroDesgravamen ? data.seguroDesgravamen : 0;
    this.seguroIncendios = data.seguroIncendios ? data.seguroIncendios : 0;
    this.seguroVehicular = data.seguroVehicular ? data.seguroVehicular : 0;
    this.montoCuotaProxima = data.montoCuotaProxima ? data.montoCuotaProxima : 0;
  }

  get calcularAmortizacion() {
    return this.saldoFecha - this.montoCuotaProxima;
  }
}
