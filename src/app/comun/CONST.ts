export class CONST {

  public static REG_EXP_USUARIO = new RegExp('^[a-z0-9]*$', 'i');
  public static REG_EXP_SOLO_LETRAS = new RegExp('^[a-z ?]*$', 'i');
  public static REG_EXP_CONTRASENHA = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,]).{0,}$');
  public static C_STR_EXP_REGULAR_EMAIL = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

  public static N_CONTRASENHA_LONGITUD_MINIMA = 8;
  public static C_INT_EDAD_MIN = 17;
  public static C_INT_EDAD_MAX = 75;
  public static C_STR_CODIGO_SUCCESS = '0000';
  public static C_STR_CODIGO_ERROR = '9999';
  public static C_STR_CODIGO_WARNING = '204';
  public static C_STR_NO_SOCIO = '205';
  public static C_STR_NO_SOLICITUD = '206';
  public static C_STR_SOCIO = '207';
  public static C_STR_SOLO_PERSONA = '208';

  public static S_ESTADO_REG_ACTIVO = '1';
  public static S_ESTADO_REG_INACTIVO = '2';

  public static DATATABLE_ES() {
    return {
      language: {
        processing: 'Procesando...',
        lengthMenu: 'Mostrar _MENU_ registros',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'Ningún dato disponible en esta tabla',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
        infoEmpty: 'Mostrando 0 de 0 de 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        infoPostFix: '',
        search: 'Buscar:',
        url: '',
        loadingRecords: 'Cargando...',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        },
        aria: {
          sortAscending: ': Activar para ordenar la columna de manera ascendente',
          sortDescending: ': Activar para ordenar la columna de manera descendente'
        }
      },
      responsive: true,
    };
  }

  public static C_OBJ_DT_OPCIONES() {
    return {
      language: {
        processing: 'Procesando...',
        lengthMenu: 'Mostrar _MENU_ registros',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'Ningún dato disponible en esta tabla',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
        infoEmpty: 'Mostrando 0 de 0 de 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        infoPostFix: '',
        search: 'Buscar:',
        url: '',
        loadingRecords: 'Cargando...',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        },
        aria: {
          sortAscending: ': Activar para ordenar la columna de manera ascendente',
          sortDescending: ': Activar para ordenar la columna de manera descendente'
        }
      },
      responsive: true,
    };
  }

  public static C_STR_EXP_REGULAR_CLAVE_USUARIO = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$';
  // public static C_STR_EXP_REGULAR_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public static C_STR_EXP_REGULAR_NUMERO = '^\\d+$';
  public static C_STR_EXP_REGULAR_NUMERO_LETRAS = '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$';
  public static C_STR_EXP_REGULAR_NUMERO_DECIMAL = '^[0-9]+([.][0-9]+)?$';
  public static C_STR_PATTERN_ELECTRONIC_BILL_SERIE = new RegExp('^([FE])...$', 'i');
  public static C_INT_CANTIDAD_NUMEROS_DECIMALES = 2;
  public static C_INT_CANTIDAD_NUMEROS_DECIMALES_MONEDA = 6;

  public static S_SEPARADOR_AUTORIZACIONES = '_';

  public static  TABLE_INT_MONTO = '00';

  public static C_INT_PUSH = 1; // "PUSH";
  public static C_INT_SMS = 2; // "SMS";
  public static C_INT_WHATSAPP = 3; // "WHATSAPP";
  public static C_INT_TELEGRAM = 4; // "TELEGRAM";
  public static C_INT_MESSAGER = 5; // "MESSAGER";
  public static C_INT_EMAIL = 6; // "EMAIL";
  public static C_INT_LLAMADAS = 7; // "LLAMADAS",

  public static  TABLE_STR_LISTA_PRODUCTO_ABACO = '22';
  public static  TABLE_STR_LISTA_BANCA_ABACO = '23';
  public static  TABLE_STR_TIPO_DIVISION_ABACO = '25';
  public static  TABLE_STR_TIPO_DE_CREDITO_ABACO = '26';
  public static  TABLE_STR_TIPO_COMERCIAL_ABACO = '27';
  public static  TABLE_STR_TIPO_DE_SOCIO_ABACO = '28';
  public static  TABLE_STR_CLASIFICACION_DEL_DEUDOR_ABACO = '29';
  public static  TABLE_STR_LISTA_SEDE = '30';
  public static  TABLE_STR_LISTA_GESTIONES = '31';
  public static  TABLE_STR_LISTA_ACTIVIDADES = '32';
  public static  TABLE_STR_LISTA_RESPUESTAS = '33';
  public static   TABLE_STR_TABLE_ESTADO_RECORDATORIOS = '35';
  public static   TABLE_STR_TABLE_TIPO_ACUERDOS = '36';
  public static   TABLE_STR_TABLE_LISTA_AREAS = '37';

  public static C_STR_ETAPA_EN_LISTA = '01'; // "MESSAGER";
  public static C_STR_ETAPA_EN_PROCESO = '02'; // "EMAIL";
  public static C_STR_ETAPA_TERMINADA = '03'; // "LLAMADAS",

  public static C_STR_CONDICION_RECORDATORIO_VIGENTE = '1'; // VIGENTE
  public static C_STR_CONDICION_RECORDATORIO_COMPLETADA = '2'; // COMPLETADA
  public static C_STR_CONDICION_RECORDATORIO_CANCELADA = '3'; // CANCELADA
  public static C_STR_CONDICION_RECORDATORIO_NO_COMPLETADA = '4'; // NO COMPLETADA


  public static C_STR_TIPO_DOCUMENTO_DNI = '1';
  public static C_STR_TIPO_DOCUMENTO_CEX = '4';
  public static C_STR_TIPO_DOCUMENTO_RUC = '6';
  public static C_STR_TIPO_DOCUMENTO_PAS = '7';
  public static C_STR_TIPO_DOCUMENTO_PNA = '11';

  public static ENUM_MONEDA = {
    SOL: 'PEN',
    DOLAR: 'USD',
    EURO: 'EUR',
  };

}
