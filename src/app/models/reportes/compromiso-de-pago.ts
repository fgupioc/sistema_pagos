export class CompromisoDePago {
  banca: string;
  cartera: string;
  diasAtraso: number;
  division: string;
  fechaCuotaPagar: string;
  fechaPagoAcuerdo: string;
  kardex: string;
  moneda: string;
  monedaCodigo: string;
  monedaPrefix: string;
  montoCobrar: number;
  montoPagar: number;
  numeroCuotasVencidas: number;
  numeroDocumentoSocio: string;
  pagoCompletoParcial: number;
  responsable: string;
  socioApellidos: string;
  socioCodigo: string;
  socioNombres: string;
  tipoDocumentoSocio: string;
  tipoProducto: string;

  constructor(data: CompromisoDePago = null) {
    if (data) {
      this.banca = data.banca || null;
      this.cartera = data.cartera || null;
      this.diasAtraso = data.diasAtraso || 0;
      this.division = data.division || null;
      this.fechaCuotaPagar = data.fechaCuotaPagar || null;
      this.fechaPagoAcuerdo = data.fechaPagoAcuerdo || null;
      this.kardex = data.kardex || null;
      this.moneda = data.moneda || null;
      this.monedaCodigo = data.monedaCodigo || null;
      this.monedaPrefix = data.monedaPrefix || null;
      this.montoCobrar = data.montoCobrar || 0;
      this.montoPagar = data.montoPagar || 0;
      this.numeroCuotasVencidas = data.numeroCuotasVencidas || 0;
      this.numeroDocumentoSocio = data.numeroDocumentoSocio || null;
      this.pagoCompletoParcial = data.pagoCompletoParcial || 0;
      this.responsable = data.responsable || null;
      this.socioApellidos = data.socioApellidos || null;
      this.socioCodigo = data.socioCodigo || null;
      this.socioNombres = data.socioNombres || null;
      this.tipoDocumentoSocio = data.tipoDocumentoSocio || null;
      this.tipoProducto = data.tipoProducto || null;
    }
  }
}
