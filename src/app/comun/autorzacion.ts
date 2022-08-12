import {CONST} from './CONST';

export const S = CONST.S_SEPARADOR_AUTORIZACIONES;

export class Autorizacion {
  public static ETAPA_LISTA = 'list';
  public static ETAPA_NUEVO = 'new';
  public static ETAPA_DETALLE = 'details';
  public static ETAPA_ACTUALIZAR = 'update';
  public static ETAPA_DISABLE = 'disable';
  public static ETAPA_MENU = 'Configuración';
  public static ETAPA_SUBMENU = 'Etapas';

  public static NOTIFY_AUTO_LISTA = 'list';
  public static NOTIFY_AUTO_NUEVO = 'new';
  public static NOTIFY_AUTO_DETALLE = 'details';
  public static NOTIFY_AUTO_ACTUALIZAR = 'update';
  public static NOTIFY_AUTO_DISABLE = 'disable';
  public static NOTIFY_AUTO_MENU = 'Configuración';
  public static NOTIFY_AUTO_SUBMENU = 'Notificación';


  public static CARTERA_LISTA = 'list';
  public static CARTERA_NUEVO = 'new';
  public static CARTERA_DETALLE = 'details';
  public static CARTERA_ACTUALIZAR = 'update';
  public static CARTERA_DISABLE = 'disable';
  public static CARTERA_ADD_ETAPAS = 'add_etapas';
  public static CARTERA_SHOW_ETAPAS = 'show_etapas';
  public static CARTERA_UPDATE_ETAPAS = 'update_etapas';
  public static CARTERA_MENU = 'Estrategia Segmentación';
  public static CARTERA_SUBMENU = 'Cartera';

  public static ASI_CAR_GESTORES = 'show_gestores';
  public static ASI_CAR_MIS_ASIGNACIONES = 'mis_asiganaciones';
  public static ASI_CAR_BUSCAR_SOCIO = 'buscar_socio';
  public static ASI_CAR_GESTIONAR_ASIGNACIONES = 'gestionar_asignacion';
  public static ASI_CAR_ASIGNACIONES = 'asignaciones';
  public static ASI_CAR_CRED_VENCIDOS = 'creditos_vencidos';
  public static ASI_CAR_SOCIO_OBSERVADOS = 'socios_observados';
  public static ASI_CAR_SHOW_CREDITOS = 'show_creditos';
  public static ASI_CAR_DETAIL_CREDITO = 'detail_credito';
  public static ASI_CAR_ADD_CREDITO = 'agregar_credito';
  public static ASI_CAR_REMOVE_CREDITO = 'eliminar_creditos';
  public static ASI_CAR_ASIGN_TAREA = 'asignar_tareas';
  public static ASI_CAR_MENU = 'Estrategia Segmentación';
  public static ASI_CAR_SUBMENU = 'Asignación Cartera';

  public static REAS_CAR_GESTORES = 'show_gestores';
  public static REAS_CAR_ASIGNACIONES = 'asignaciones';
  public static REAS_CAR_REASIGNAR = 'reasignar';
  public static REAS_CAR_CAMBIAR_GESTOR = 'cambiar_gestor';
  public static REAS_CAR_DETALLE_CREDITO = 'detalle_credito';
  public static REAS_CAR_MENU = 'Estrategia Segmentación';
  public static REAS_CAR_SUBMENU = 'Reasignación cartera';

  public static NOTIFICACION_SHOW = 'show';
  public static NOTIFICACION_MENU = 'Estrategia Segmentación';
  public static NOTIFICACION_SUBMENU = 'Notificaciones Automáticas';

  public static CARTERA_ASIG_SHOW = 'show';
  public static CARTERA_ASIG_MENU = 'Estrategia Segmentación';
  public static CARTERA_ASIG_SUBMENU = 'Carteras Asignadas';

  public static CARGA_MANUAL_CARGAR = 'ejecutar_carga';
  public static CARGA_MANUAL_MENU = 'Procesos';
  public static CARGA_MANUAL_SUBMENU = 'Carga Manual';

  public static TAREA_NEW_TABLERO = 'new_tablero';
  public static TAREA_ADD_TAREA = 'add_tarea';
  public static TAREA_SHOW_TABLERO = 'show_tablero';
  public static TAREA_SHOW_TAREA = 'show_tarea';
  public static TAREA_ADD_FILE = 'add_files';
  public static TAREA_ADD_COMMITS = 'add_commits';
  public static TAREA_MENU = 'Gestión Administrativa';
  public static TAREA_SUBMENU = 'Tareas';

  public static MIS_TAREA_SHOW = 'show';
  public static MIS_TAREA_MENU = 'Gestión Administrativa';
  public static MIS_TAREA_SUBMENU = 'Mis Tareas';

  public static MIS_GESTIONES_SHOW = 'show';
  public static MIS_GESTIONES_SHOW_CREDITO = 'show_credito';
  public static MIS_GESTIONES_ADD_TAREA = 'add_tarea';
  public static MIS_GESTIONES_ADD_TABLERO = 'add_tablero';
  public static MIS_GESTIONES_SEND_EMAIL = 'send_email';
  public static MIS_GESTIONES_URL_SELFTSERVICE = 'url_selfservice';
  public static MIS_GESTIONES_SEND_WHATSAPP = 'send_whatsapp';
  public static MIS_GESTIONES_NEW_GESTION = 'new_gestion';
  public static MIS_GESTIONES_ADD_PHONE = 'add_phone';
  public static MIS_GESTIONES_REMOVE_PHONE = 'remove_phone';
  public static MIS_GESTIONES_NEW_EMAIL = 'new_email';
  public static MIS_GESTIONES_REMOVE_EMAIL = 'remove_email';
  public static MIS_GESTIONES_ADD_ADDRESS = 'add_address';
  public static MIS_GESTIONES_REMOVE_COMPROMISO = 'remove_compromiso';
  public static MIS_GESTIONES_NEW_COMPROMISO_PAGO = 'new_compromiso_pago';
  public static MIS_GESTIONES_MENU = 'Gestión Administrativa';
  public static MIS_GESTIONES_SUBMENU = 'Mis Gestiones';

  // MANTENIMIENTO
  public static TIPO_USUARIO_CODE = '201051';

  public static ESTADO_REGISTRO_CODE = '201052';

  public static TIPO_MONEDA_CODE = '201053';

  public static CONDICION_SOLICITUD_CODE = '201054';

  public static TIPO_CREDITO_CODE = '201055';

  public static TIPO_COBRANZA_CODE = '201056';

  public static TIPO_INTERES_CODE = '201057';

  public static TIPO_TASA_CODE = '201058';

  public static TIPO_DIRECCION_CODE = '201059';

  public static TIPO_VIVIENDA_CODE = '201060';

  public static TIPO_VIAS_CODE = '201061';

  public static TIPO_SECCION_CODE = '201062';

  public static TIPO_ZONAS_CODE = '201063';

  public static TIPO_SECTORES_CODE = '201064';

  public static TIPO_USO_TELEFONO_CODE = '201065';

  public static TIPO_OPERADOR_CODE = '201066';

  public static TIPO_TELEFONO_CODE = '201067';

  public static TIPO_INDICADORES_CODE = '201068';

  public static TIPO_DOCUMENTOS_CODE = '201069';

  public static ESTADO_CIVIL_CODE = '201070';

  public static TIPO_GENERO_CODE = '201071';

  public static LISTA_SEDES_CODE = '201072';

  public static DESTINO_CREDITO_CODE = '201073';
}
