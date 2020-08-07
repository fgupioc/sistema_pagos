import {CONST} from './CONST';

export const S = CONST.S_SEPARADOR_AUTORIZACIONES;

export class Autorizacion {

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

  public static CARTERA_LISTAR = '101084' + S + 'listar';
  public static CARTERA_CREAR = '101084' + S + 'crear';
  public static CARTERA_ACTUALIZAR = '101084' + S + 'actualizar';
  public static CARTERA_ELIMINAR = '101084' + S + 'eliminar';
  
  // MANTENIMIENTO
  public static TIPO_USUARIO_CODE = '201051';
  public static TIPO_USUARIO_LISTAR = Autorizacion.TIPO_USUARIO_CODE + S + 'listar';
  public static TIPO_USUARIO_CREAR = Autorizacion.TIPO_USUARIO_CODE + S + 'crear';
  public static TIPO_USUARIO_ACTUALIZAR = Autorizacion.TIPO_USUARIO_CODE + S + 'actualizar';
  public static TIPO_USUARIO_ELIMINAR = Autorizacion.TIPO_USUARIO_CODE + S + 'eliminar';

  public static ESTADO_REGISTRO_CODE = '201052';
  public static ESTADO_REGISTRO_LISTAR = Autorizacion.ESTADO_REGISTRO_CODE + S + 'listar';
  public static ESTADO_REGISTRO_CREAR = Autorizacion.ESTADO_REGISTRO_CODE + S + 'crear';
  public static ESTADO_REGISTRO_ACTUALIZAR = Autorizacion.ESTADO_REGISTRO_CODE + S + 'actualizar';
  public static ESTADO_REGISTRO_ELIMINAR = Autorizacion.ESTADO_REGISTRO_CODE + S + 'eliminar';

  public static TIPO_MONEDA_CODE = '201053';
  public static TIPO_MONEDA_LISTAR = Autorizacion.TIPO_MONEDA_CODE + S + 'listar';
  public static TIPO_MONEDA_CREAR = Autorizacion.TIPO_MONEDA_CODE + S + 'crear';
  public static TIPO_MONEDA_ACTUALIZAR = Autorizacion.TIPO_MONEDA_CODE + S + 'actualizar';
  public static TIPO_MONEDA_ELIMINAR = Autorizacion.TIPO_MONEDA_CODE + S + 'eliminar';

  public static CONDICION_SOLICITUD_CODE = '201054';
  public static CONDICION_SOLICITUD_LISTAR = Autorizacion.CONDICION_SOLICITUD_CODE + S + 'listar';
  public static CONDICION_SOLICITUD_CREAR = Autorizacion.CONDICION_SOLICITUD_CODE + S + 'crear';
  public static CONDICION_SOLICITUD_ACTUALIZAR = Autorizacion.CONDICION_SOLICITUD_CODE + S + 'actualizar';
  public static CONDICION_SOLICITUD_ELIMINAR = Autorizacion.CONDICION_SOLICITUD_CODE + S + 'eliminar';

  public static TIPO_CREDITO_CODE = '201055';
  public static TIPO_CREDITO_LISTAR = Autorizacion.TIPO_CREDITO_CODE + S + 'listar';
  public static TIPO_CREDITO_CREAR = Autorizacion.TIPO_CREDITO_CODE + S + 'crear';
  public static TIPO_CREDITO_ACTUALIZAR = Autorizacion.TIPO_CREDITO_CODE + S + 'actualizar';
  public static TIPO_CREDITO_ELIMINAR = Autorizacion.TIPO_CREDITO_CODE + S + 'eliminar';

  public static TIPO_COBRANZA_CODE = '201056';
  public static TIPO_COBRANZA_LISTAR = Autorizacion.TIPO_COBRANZA_CODE + S + 'listar';
  public static TIPO_COBRANZA_CREAR = Autorizacion.TIPO_COBRANZA_CODE + S + 'crear';
  public static TIPO_COBRANZA_ACTUALIZAR = Autorizacion.TIPO_COBRANZA_CODE + S + 'actualizar';
  public static TIPO_COBRANZA_ELIMINAR = Autorizacion.TIPO_COBRANZA_CODE + S + 'eliminar';

  public static TIPO_INTERES_CODE = '201057';
  public static TIPO_INTERES_LISTAR = Autorizacion.TIPO_INTERES_CODE + S + 'listar';
  public static TIPO_INTERES_CREAR = Autorizacion.TIPO_INTERES_CODE + S + 'crear';
  public static TIPO_INTERES_ACTUALIZAR = Autorizacion.TIPO_INTERES_CODE + S + 'actualizar';
  public static TIPO_INTERES_ELIMINAR = Autorizacion.TIPO_INTERES_CODE + S + 'eliminar';

  public static TIPO_TASA_CODE = '201058';
  public static TIPO_TASA_LISTAR = Autorizacion.TIPO_TASA_CODE + S + 'listar';
  public static TIPO_TASA_CREAR = Autorizacion.TIPO_TASA_CODE + S + 'crear';
  public static TIPO_TASA_ACTUALIZAR = Autorizacion.TIPO_TASA_CODE + S + 'actualizar';
  public static TIPO_TASA_ELIMINAR = Autorizacion.TIPO_TASA_CODE + S + 'eliminar';

  public static TIPO_DIRECCION_CODE = '201059';
  public static TIPO_DIRECCION_LISTAR = Autorizacion.TIPO_DIRECCION_CODE + S + 'listar';
  public static TIPO_DIRECCION_CREAR = Autorizacion.TIPO_DIRECCION_CODE + S + 'crear';
  public static TIPO_DIRECCION_ACTUALIZAR = Autorizacion.TIPO_DIRECCION_CODE + S + 'actualizar';
  public static TIPO_DIRECCION_ELIMINAR = Autorizacion.TIPO_DIRECCION_CODE + S + 'eliminar';

  public static TIPO_VIVIENDA_CODE = '201060';
  public static TIPO_VIVIENDA_LISTAR = Autorizacion.TIPO_VIVIENDA_CODE + S + 'listar';
  public static TIPO_VIVIENDA_CREAR = Autorizacion.TIPO_VIVIENDA_CODE + S + 'crear';
  public static TIPO_VIVIENDA_ACTUALIZAR = Autorizacion.TIPO_VIVIENDA_CODE + S + 'actualizar';
  public static TIPO_VIVIENDA_ELIMINAR = Autorizacion.TIPO_VIVIENDA_CODE + S + 'eliminar';

  public static TIPO_VIAS_CODE = '201061';
  public static TIPO_VIAS_LISTAR = Autorizacion.TIPO_VIAS_CODE + S + 'listar';
  public static TIPO_VIAS_CREAR =  Autorizacion.TIPO_VIAS_CODE + S + 'crear';
  public static TIPO_VIAS_ACTUALIZAR =  Autorizacion.TIPO_VIAS_CODE + S + 'actualizar';
  public static TIPO_VIAS_ELIMINAR =  Autorizacion.TIPO_VIAS_CODE + S + 'eliminar';

  public static TIPO_SECCION_CODE = '201062';
  public static TIPO_SECCION_LISTAR =  Autorizacion.TIPO_SECCION_CODE + S + 'listar';
  public static TIPO_SECCION_CREAR =  Autorizacion.TIPO_SECCION_CODE + S + 'crear';
  public static TIPO_SECCION_ACTUALIZAR =  Autorizacion.TIPO_SECCION_CODE + S + 'actualizar';
  public static TIPO_SECCION_ELIMINAR =  Autorizacion.TIPO_SECCION_CODE + S + 'eliminar';

  public static TIPO_ZONAS_CODE = '201063';
  public static TIPO_ZONAS_LISTAR = Autorizacion.TIPO_ZONAS_CODE + S + 'listar';
  public static TIPO_ZONAS_CREAR = Autorizacion.TIPO_ZONAS_CODE + S + 'crear';
  public static TIPO_ZONAS_ACTUALIZAR = Autorizacion.TIPO_ZONAS_CODE + S + 'actualizar';
  public static TIPO_ZONAS_ELIMINAR = Autorizacion.TIPO_ZONAS_CODE + S + 'eliminar';

  public static TIPO_SECTORES_CODE = '201064';
  public static TIPO_SECTORES_LISTAR = Autorizacion.TIPO_SECTORES_CODE + S + 'listar';
  public static TIPO_SECTORES_CREAR = Autorizacion.TIPO_SECTORES_CODE + S + 'crear';
  public static TIPO_SECTORES_ACTUALIZAR = Autorizacion.TIPO_SECTORES_CODE + S + 'actualizar';
  public static TIPO_SECTORES_ELIMINAR = Autorizacion.TIPO_SECTORES_CODE + S + 'eliminar';

  public static TIPO_USO_TELEFONO_CODE = '201065';
  public static TIPO_USO_TELEFONO_LISTAR = Autorizacion.TIPO_USO_TELEFONO_CODE + S + 'listar';
  public static TIPO_USO_TELEFONO_CREAR = Autorizacion.TIPO_USO_TELEFONO_CODE + S + 'crear';
  public static TIPO_USO_TELEFONO_ACTUALIZAR = Autorizacion.TIPO_USO_TELEFONO_CODE + S + 'actualizar';
  public static TIPO_USO_TELEFONO_ELIMINAR = Autorizacion.TIPO_USO_TELEFONO_CODE + S + 'eliminar';

  public static TIPO_OPERADOR_CODE = '201066';
  public static TIPO_OPERADOR_LISTAR = Autorizacion.TIPO_OPERADOR_CODE + S + 'listar';
  public static TIPO_OPERADOR_CREAR = Autorizacion.TIPO_OPERADOR_CODE + S + 'crear';
  public static TIPO_OPERADOR_ACTUALIZAR = Autorizacion.TIPO_OPERADOR_CODE + S + 'actualizar';
  public static TIPO_OPERADOR_ELIMINAR = Autorizacion.TIPO_OPERADOR_CODE + S + 'eliminar';

  public static TIPO_TELEFONO_CODE = '201067';
  public static TIPO_TELEFONO_LISTAR = Autorizacion.TIPO_TELEFONO_CODE + S + 'listar';
  public static TIPO_TELEFONO_CREAR = Autorizacion.TIPO_TELEFONO_CODE + S + 'crear';
  public static TIPO_TELEFONO_ACTUALIZAR = Autorizacion.TIPO_TELEFONO_CODE + S + 'actualizar';
  public static TIPO_TELEFONO_ELIMINAR = Autorizacion.TIPO_TELEFONO_CODE + S + 'eliminar';

  public static TIPO_INDICADORES_CODE = '201068';
  public static TIPO_INDICADORES_LISTAR = Autorizacion.TIPO_INDICADORES_CODE + S + 'listar';
  public static TIPO_INDICADORES_CREAR = Autorizacion.TIPO_INDICADORES_CODE + S + 'crear';
  public static TIPO_INDICADORES_ACTUALIZAR = Autorizacion.TIPO_INDICADORES_CODE + S + 'actualizar';
  public static TIPO_INDICADORES_ELIMINAR = Autorizacion.TIPO_INDICADORES_CODE + S + 'eliminar';

  public static TIPO_DOCUMENTOS_CODE = '201069';
  public static TIPO_DOCUMENTOS_LISTAR = Autorizacion.TIPO_DOCUMENTOS_CODE + S + 'listar';
  public static TIPO_DOCUMENTOS_CREAR = Autorizacion.TIPO_DOCUMENTOS_CODE + S + 'crear';
  public static TIPO_DOCUMENTOS_ACTUALIZAR = Autorizacion.TIPO_DOCUMENTOS_CODE + S + 'actualizar';
  public static TIPO_DOCUMENTOS_ELIMINAR = Autorizacion.TIPO_DOCUMENTOS_CODE + S + 'eliminar';

  public static ESTADO_CIVIL_CODE = '201070';
  public static ESTADO_CIVIL_LISTAR = Autorizacion.ESTADO_CIVIL_CODE + S + 'listar';
  public static ESTADO_CIVIL_CREAR = Autorizacion.ESTADO_CIVIL_CODE + S + 'crear';
  public static ESTADO_CIVIL_ACTUALIZAR = Autorizacion.ESTADO_CIVIL_CODE + S + 'actualizar';
  public static ESTADO_CIVIL_ELIMINAR = Autorizacion.ESTADO_CIVIL_CODE + S + 'eliminar';

  public static TIPO_GENERO_CODE = '201071';
  public static TIPO_GENERO_LISTAR = Autorizacion.TIPO_GENERO_CODE + S + 'listar';
  public static TIPO_GENERO_CREAR = Autorizacion.TIPO_GENERO_CODE + S + 'crear';
  public static TIPO_GENERO_ACTUALIZAR = Autorizacion.TIPO_GENERO_CODE + S + 'actualizar';
  public static TIPO_GENERO_ELIMINAR = Autorizacion.TIPO_GENERO_CODE + S + 'eliminar';

  public static LISTA_SEDES_CODE = '201072';
  public static LISTA_SEDES_LISTAR = Autorizacion.LISTA_SEDES_CODE + S + 'listar';
  public static LISTA_SEDES_CREAR = Autorizacion.LISTA_SEDES_CODE + S + 'crear';
  public static LISTA_SEDES_ACTUALIZAR = Autorizacion.LISTA_SEDES_CODE + S + 'actualizar';
  public static LISTA_SEDES_ELIMINAR = Autorizacion.LISTA_SEDES_CODE + S + 'eliminar';

  public static DESTINO_CREDITO_CODE = '201073';
  public static DESTINO_CREDITO_LISTAR = Autorizacion.DESTINO_CREDITO_CODE + S + 'listar';
  public static DESTINO_CREDITO_CREAR = Autorizacion.DESTINO_CREDITO_CODE + S + 'crear';
  public static DESTINO_CREDITO_ACTUALIZAR = Autorizacion.DESTINO_CREDITO_CODE + S + 'actualizar';
  public static DESTINO_CREDITO_ELIMINAR = Autorizacion.DESTINO_CREDITO_CODE + S + 'eliminar';
}
