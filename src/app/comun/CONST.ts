export class CONST {

  public static REG_EXP_USUARIO = new RegExp('^[a-z0-9]*$', 'i');

  public static REG_EXP_CONTRASENHA = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,]).{0,}$');

  public static N_CONTRASENHA_LONGITUD_MINIMA = 8;


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

  public static C_STR_EXP_REGULAR_CLAVE_USUARIO = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$';
  public static C_STR_EXP_REGULAR_EMAIL = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public static C_STR_EXP_REGULAR_NUMERO = '^\\d+$';
  public static C_STR_EXP_REGULAR_NUMERO_LETRAS = '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$';
  public static C_STR_EXP_REGULAR_NUMERO_DECIMAL = '^[0-9]+([.][0-9]+)?$';
  public static C_STR_PATTERN_ELECTRONIC_BILL_SERIE = new RegExp('^([FE])...$', 'i');
  public static C_INT_CANTIDAD_NUMEROS_DECIMALES = 2;
  public static C_INT_CANTIDAD_NUMEROS_DECIMALES_MONEDA = 6;
}
