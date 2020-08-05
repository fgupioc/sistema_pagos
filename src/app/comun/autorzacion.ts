import {CONST} from './CONST';

export const S = CONST.S_SEPARADOR_AUTORIZACIONES;

export class Autorizacion {

  // ESCRITORIO
  public static REG_COMPROBANTE_FILTRAR = '1000101' + S + 'filtrar';
  public static REG_COMPROBANTE_DESCARGAR_XML = '1000101' + S + 'descargar.xml';
  public static REG_COMPROBANTE_VER = '1000101' + S + 'ver';
  public static REG_COMPROBANTE_IMPRIMIR = '1000101' + S + 'imprimir';
  public static REG_COMPROBANTE_CREAR = '1000101' + S + 'crear';
  public static REG_COMPROBANTE_ELIMINAR = '1000101' + S + 'eliminar';
  public static REG_COMPROBANTE_ACTUALIZAR = '1000101' + S + 'actualizar';
  public static REG_COMPROBANTE_AGREGAR_FACTURA_NEGOCIABLE = '1000101' + S + 'agregar.fact.negociable';
  public static REG_COMPROBANTE_AGREGAR_NOTA_CREDITO = '1000101' + S + 'agregar.nota.credito';
  public static REG_COMPROBANTE_AGREGAR_NOTA_DEBITO = '1000101' + S + 'agregar.nota.debito';
  public static REG_COMPROBANTE_ACTUALIZAR_NOTA_CREDITO = '1000101' + S + 'actualizar.nota.credito';
  public static REG_COMPROBANTE_ACTUALIZAR_NOTA_DEBITO = '1000101' + S + 'actualizar.nota.debito';

  public static CALCULADORA_FACTORING_GUARDAR_CALCULO = '1000103' + S + 'guardar';
  public static CALCULADORA_FACTORING_VER_HISTORIAL = '1000103' + S + 'ver.historial';

  public static CALENDARIO_VER = '1000105' + S + 'ver';

  public static NOTIFICACION_LISTAR = '1000106' + S + 'listar';
  public static NOTIFICACION_VER = '1000106' + S + 'ver';

  // CONSULTAS
  public static SOCIO_CONSULTAR = '1010301' + S + 'consultar';
  public static SOCIO_REGISTRAR_PROSPECTO = '1010301' + S + 'registrar.prospecto';
  public static SOCIO_EVALUAR_SOLICITUD = '1010301' + S + 'evaluar.solicitud';
  public static SOCIO_CONVERTIR_DEUDOR_A_SOCIO_JURIDICO = '1010301' + S + 'convertir.deudor.a.socio.juridico';

  public static DEUDOR_CONSULTAR = '1010302' + S + 'consultar';
  public static DEUDOR_REGISTRAR_PROSPECTO = '1010302' + S + 'registrar.prospecto';
  public static DEUDOR_EVALUAR_SOLICITUD = '1010302' + S + 'evaluar.solicitud';

  public static COMPROBANTE_FILTRAR = '1010303' + S + 'filtrar';
  public static COMPROBANTE_DESCARGAR_XML = '1010303' + S + 'descargar.xml';
  public static COMPROBANTE_VER = '1010303' + S + 'ver';
  public static COMPROBANTE_IMPRIMIR = '1010303' + S + 'imprimir';

  public static COMPROBANTE_CONSULTA_ESTADO_FN = '1010304' + S + 'consulta.estado.fn';

  // OPERACIONES
  public static DESCUENTOS_FILTRAR = '1010501' + S + 'filtrar';
  public static DESCUENTOS_APLICAR_DESCUENTO = '1010501' + S + 'aplicar.descuento';
  // public static DESCUENTOS_EVALUAR_DESCUENTO = '1010501' + S + 'evaluar.descuento';
  public static DESCUENTOS_APROBAR_SOLICITUD = '1010501' + S + 'aprobar.solicitud';
  public static DESCUENTOS_RECHAZAR_SOLICITUD = '1010501' + S + 'rechazar.solicitud';

  public static DESEMBOLSAR_FACTURA_FILTRAR = '1010503' + S + 'filtrar';
  public static DESEMBOLSAR_SOLICITAR_AUTORIZACION_DESEMBOLSO = '1010503' + S + 'solicitar.autorizacion.desembolso';
  public static DESEMBOLSAR_FACTURA_DESEMBOLSAR = '1010503' + S + 'desembolsar';

  public static AUTORIZAR_DESEMBOLSO_LISTAR = '1010504' + S + 'listar';
  public static AUTORIZAR_DESEMBOLSO_APROBAR = '1010504' + S + 'aprobar.solicitud.desembolso';
  public static AUTORIZAR_DESEMBOLSO_RECHAZAR = '1010504' + S + 'rechazar.solicitud.desembolso';

  // MANTENIMIENTO
  public static TASA_DESCUENTO_LISTAR = '1010601' + S + 'listar';
  public static TASA_DESCUENTO_CREAR = '1010601' + S + 'crear';
  public static TASA_DESCUENTO_ACTUALIZAR = '1010601' + S + 'actualizar';
  public static TASA_DESCUENTO_ELIMINAR = '1010601' + S + 'eliminar';

  public static COMISION_LISTAR = '1010602' + S + 'listar';
  public static COMISION_CREAR = '1010602' + S + 'crear';
  public static COMISION_ACTUALIZAR = '1010602' + S + 'actualizar';
  public static COMISION_ELIMINAR = '1010602' + S + 'eliminar';

  public static GASTO_LISTAR = '1010603' + S + 'listar';
  public static GASTO_CREAR = '1010603' + S + 'crear';
  public static GASTO_ACTUALIZAR = '1010603' + S + 'actualizar';
  public static GASTO_ELIMINAR = '1010603' + S + 'eliminar';

  public static CAMBIO_MONEDA_LISTAR = '1010604' + S + 'listar';
  public static CAMBIO_MONEDA_CREAR = '1010604' + S + 'crear';
  public static CAMBIO_MONEDA_ACTUALIZAR = '1010604' + S + 'actualizar';
  public static CAMBIO_MONEDA_ELIMINAR = '1010604' + S + 'eliminar';

  public static ESTADO_CIVIL_LISTAR = '1010605' + S + 'listar';
  public static ESTADO_CIVIL_CREAR = '1010605' + S + 'crear';
  public static ESTADO_CIVIL_ACTUALIZAR = '1010605' + S + 'actualizar';
  public static ESTADO_CIVIL_ELIMINAR = '1010605' + S + 'eliminar';

  public static TIPO_OPERADOR_LISTAR = '1010606' + S + 'listar';
  public static TIPO_OPERADOR_CREAR = '1010606' + S + 'crear';
  public static TIPO_OPERADOR_ACTUALIZAR = '1010606' + S + 'actualizar';
  public static TIPO_OPERADOR_ELIMINAR = '1010606' + S + 'eliminar';

  // SEGURIDAD
  public static ROL_LISTAR = '101061' + S + 'listar';
  public static ROL_CREAR = '101061' + S + 'crear';
  public static ROL_ACTUALIZAR = '101061' + S + 'actualizar';

  public static USUARIO_LISTAR = '101060' + S + 'listar';
  public static USUARIO_CREAR = '101060' + S + 'crear';
  public static USUARIO_ACTUALIZAR = '101060' + S + 'actualizar';
  public static USUARIO_ACTUALIZAR_CONTRASENHA = '101060' + S + 'actualizar.contrasenha';

  public static ACCESO_LISTAR = '1010703' + S + 'listar';
  public static ACCESO_ACTUALIZAR = '1010703' + S + 'actualizar';
}
