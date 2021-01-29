export class PagosRealizadosPorDia {
  socioCodigo: string;
  socioNombres: string;
  socioApellidos: string;
  kardex: string;
  monedaCodigo: string;
  moneda: string;
  monedaPrefix: string;
  tipoProducto: string;
  montoPrestamo: number;
  deudaTotal: number;
  saldoCapital: number;
  fechaVencimiento: number;
  cantidadCuotas: number;
  numeroCuotaDelMes: number;
  cantidadCuotasVencidas: number;
  montoDeLaCuotaDelMes: number;
  montoDeLasCuotasVencidas: number;
  totalPagarFecha: number;
  montoPagado: number;
  montoPagadoDeCuotasVencidas: number;
  montoPagadoDeCuotasAdelantadas: number;
  tipoPago: string;
  reprogramado: string;
  tipoSocio: string;
  division: string;
  banca: string;
  sectorEconomico: string;
  modalidadPago: string;
  institucionFinanciera: string;
  lineasPrestamoIF: string;
  deudaTotalLineasIF: number;
  deudaTotalPrestamosIF: number;

  constructor(data: PagosRealizadosPorDia = null) {
    if (data) {
      this.socioCodigo = data.socioCodigo || null;
      this.socioNombres = data.socioNombres || null;
      this.socioApellidos = data.socioApellidos || null;
      this.kardex = data.kardex || null;
      this.monedaCodigo = data.monedaCodigo || null;
      this.moneda = data.moneda || null;
      this.monedaPrefix = data.monedaPrefix || null;
      this.tipoProducto = data.tipoProducto || null;
      this.montoPrestamo = data.montoPrestamo || 0;
      this.deudaTotal = data.deudaTotal || 0;
      this.saldoCapital = data.saldoCapital || 0;
      this.fechaVencimiento = data.fechaVencimiento || 0;
      this.cantidadCuotas = data.cantidadCuotas || 0;
      this.numeroCuotaDelMes = data.numeroCuotaDelMes || 0;
      this.cantidadCuotasVencidas = data.cantidadCuotasVencidas || 0;
      this.montoDeLaCuotaDelMes = data.montoDeLaCuotaDelMes || 0;
      this.montoDeLasCuotasVencidas = data.montoDeLasCuotasVencidas || 0;
      this.totalPagarFecha = data.totalPagarFecha || 0;
      this.montoPagado = data.montoPagado || 0;
      this.montoPagadoDeCuotasVencidas = data.montoPagadoDeCuotasVencidas || 0;
      this.montoPagadoDeCuotasAdelantadas = data.montoPagadoDeCuotasAdelantadas || 0;
      this.tipoPago = data.tipoPago || null;
      this.reprogramado = data.reprogramado || null;
      this.tipoSocio = data.tipoSocio || null;
      this.division = data.division || null;
      this.banca = data.banca || null;
      this.sectorEconomico = data.sectorEconomico || null;
      this.modalidadPago = data.modalidadPago || null;
      this.institucionFinanciera = data.institucionFinanciera || null;
      this.lineasPrestamoIF = data.lineasPrestamoIF || null;
      this.deudaTotalLineasIF = data.deudaTotalLineasIF || 0;
      this.deudaTotalPrestamosIF = data.deudaTotalPrestamosIF || 0;
    }
  }
}
