import {CONST} from './CONST';

export const S = CONST.S_SEPARADOR_AUTORIZACIONES;

export class Autorizacion {


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

  public static NOTIFICACION_LISTAR = '101070' + S + 'listar';
  public static NOTIFICACION_CREAR = '101070' + S + 'crear';
  public static NOTIFICACION_ACTUALIZAR = '101070' + S + 'actualizar';

  public static ENVIAR_NOTIFICACION_LISTAR = '101071' + S + 'listar';
  public static ENVIAR_NOTIFICACION_CREAR = '101071' + S + 'crear';
  public static ENVIAR_NOTIFICACION_ACTUALIZAR = '101071' + S + 'actualizar';

  public static TIPO_NOTIFICACION_LISTAR = '101100' + S + 'listar';
  public static TIPO_NOTIFICACION_CREAR = '101100' + S + 'crear';
  public static TIPO_NOTIFICACION_ACTUALIZAR = '101100' + S + 'actualizar';
  public static TIPO_NOTIFICACION_ELIMINAR = '101100' + S + 'eliminar';

  public static CARTERA_LISTAR = '1010800' + S + 'listar';
  public static CARTERA_CREAR = '1010800' + S + 'crear';
  public static CARTERA_ACTUALIZAR = '1010800' + S + 'actualizar';
  public static CARTERA_ELIMINAR = '1010800' + S + 'eliminar';

  public static TIPO_USUARIO_LISTAR = '201051' + S + 'listar';
  public static TIPO_USUARIO_CREAR = '201051' + S + 'crear';
  public static TIPO_USUARIO_ACTUALIZAR = '201051' + S + 'actualizar';
  public static TIPO_USUARIO_ELIMINAR = '201051' + S + 'eliminar';

  public static ESTADO_REGISTRO_LISTAR = '201052' + S + 'listar';
  public static ESTADO_REGISTRO_CREAR = '201052' + S + 'crear';
  public static ESTADO_REGISTRO_ACTUALIZAR = '201052' + S + 'actualizar';
  public static ESTADO_REGISTRO_ELIMINAR = '201052' + S + 'eliminar';
}
