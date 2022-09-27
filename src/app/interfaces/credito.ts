export interface Credito {
  abonoCargoACuenta?: boolean;
  abonoCobranzaItinerante?: boolean;
  abonoPorConvenio?: boolean;
  alias?: string;
  calificacionCreditoSBS?: string;
  calificacionCreditoSBSManual?: string;
  cargosDiferidos?: number;
  carteraId?: number;
  codAgenciaDeLaSolicitud?: string;
  codAnalistaResponsable?: string;
  codCobradorItinerante?: string;
  codCondicionSolicitud?: string;
  codEjecutivoCuenta?: string;
  codEmpresa?: string;
  codEstadoCuentaCredito?: string;
  codFuenteFinanciamiento?: string;
  codLineaFinanciamiento?: string;
  codMoneda?: string;
  codPersonaDescuentoPlanilla?: string;
  codTipoCobranza?: string;
  codTipoCreditoPreAprobado?: string;
  codTipoInteres?: string;
  codTipoTasa?: string;
  creditoPreAprobado?: boolean;
  diaPago?: number;
  diasAtraso?: number;
  diasGraciaPagoMora?: number;
  estadoContableCredito?: string;
  fechaAprobacion?: string;
  fechaAsignacionCalificacionSBS?: string;
  fechaAsignacionCalificacionSBSManual?: string;
  fechaCancelacionCuentaCredito?: string;
  fechaInsercionDeRegistro?: string;
  fechaPrimerVencimiento?: string;
  fechaUltimaLiquidacionIntereses?: string;
  fechaUltimaModificacionRegistro?: string;
  fechaUltimoPago?: string;
  fechaUltimoPagoInteres?: string;
  fechaUltimoPagoPrincipal?: string;
  fechaVencimiento?: string;
  frecuenciaPago?: string;
  gastosLegales?: number;
  gastosLegalesDiferidos?: number;
  honorarioAbogado?: number;
  honorarioAbogadoDiferido?: number;
  id?: number;
  interesCompensatorio?: number;
  interesCuota?: number;
  interesDiferido?: number;
  interesesPospuestos?: number;
  interesesVencidos?: number;
  ipTerminalInsertoRegistro?: string;
  ipUltimaModificacionRegistro?: string;
  montoAportaciones?: number;
  montoCargos?: number;
  montoComision?: number;
  montoCredito?: number;
  montoCuota?: number;
  montoInteresEnSuspensoLiquidado?: number;
  montoInteresVencidoPagado?: number;
  montoInteresesLiquidados?: number;
  montoInteresesPagados?: number;
  montoMora?: number;
  montoUltimoPago?: number;
  moraDiferida?: number;
  motivoCancelacionCuentaCredito?: string;
  nombreTerminalInsertoRegistro?: string;
  nombreTerminalUltimaModificacionRegistro?: string;
  nroCondicionCredito?: number;
  nroConvenio?: string;
  nroCredito?: string;
  nroCuentaEfectivo?: string;
  nroCuotas?: number;
  nroCuotasGracia?: number;
  nroCuotasPagadas?: number;
  nroDesembolsoCredito?: string;
  nroFichaPlanilla?: string;
  nroPagare?: string;
  nroSolicitudCredito?: string;
  periodoGracio?: boolean;
  plazoCreditoDias?: number;
  porcentajeSobreGiroCreditoPreAprobado?: number;
  producto?: string;
  saldoCapital?: number;
  saldoDeDeuda?: number;
  seguroDesgravamen?: number;
  situacionDeCobranza?: string;
  socioId?: number;
  subTipoCredito?: string;
  tasaInteresCompensatorio?: number;
  tasaInteresCuota?: number;
  tasaInteresMoratorio?: number;
  tieneAval?: boolean;
  tieneGarantia?: boolean;
  tipoCalendario?: string;
  tipoCredito?: string;
  tipoCuota?: string;
  tipoPlanilla?: string;
  usuarioAsignaCalificacionSBSCreditoManual?: string;
  usuarioInsertoRegistro?: string;
  usuarioUltimaModificacionRegistro?: string;
  zonaCobranza?: string;
  asignacionId?: number;
  cronogramas?: any[];
  montoAtrasado?: number;
  fechaProximoVencimiento?: string;
}
