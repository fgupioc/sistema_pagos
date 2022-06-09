export class UtilsFormats {

  /**
   * Colores usado en el reporte de negocios
   */
  public static COLOR_1 = '#008b8b';
  public static COLOR_2 = '#00ffff';
  public static COLOR_3 = '#c3b091';
  public static COLOR_4 = '#e6e6fa';
  public static COLOR_5 = '#ffa500';
  public static COLOR_6 = '#61ff1e';

  public static COLOR_XPROCESO = '#c3b091';
  public static COLOR_MONTO = '#008b8b';
  public static COLOR_META = '#e6e6fa';
  public static COLOR_META2 = '#9999f3';
  public static COLOR_OPORTUNIDAD = '#00ffff';
  public static COLOR_NEGRO = '#000';
  public static COLOR_SEMAFORO_VERDE = '#00FF00';
  public static COLOR_SEMAFORO_AMARILLO = '#FCE903';
  public static COLOR_SEMAFORO_ROJO = '#F00';
  public static COLOR_TRANSPARENTE = 'transparent';
  public static COLOR_RGBA_TRANSPARENTE = 'rgba(0, 0, 0, 0)';

  public static SEMAFORO_ROJO = 'ROJO';
  public static SEMAFORO_AMARILLO = 'AMARILLO';
  public static SEMAFORO_VERDE = 'VERDE';

  /**
   * Método para simplificar numeros grandes en grafico.
   * Cuando el número es mayor a 1000
   *
   * @param numero
   */
  public static mostrarNumeroSimplificado(numero: number): string {
    if (!numero) {
      return '0';
    }
    return (numero >= 1000) ? `${this.simplificaNumero(numero)} ${this.mostrarSufijoNumeroEnLetras(numero)}` : numero + '';
  }

  public static mostrarNumeroSimplificadoYRedondeado(numero: number): string {
    if (!numero) {
      return '0';
    }

    return (numero >= 1000) ? `${(Math.round(this.simplificaNumero(numero)))} ${this.mostrarSufijoNumeroEnLetras(numero)}` : Math.round(numero) + '';
  }

  public static alcanzoLaMeta(monto: number, meta: number): boolean {
    if (meta == 0) {
      return false;
    }
    return monto >= meta;
  }

  public static calcularMetaEstiloSemaforo(monto: number, meta: number): string {
    if (meta == 0) {
      return '';
    }
    const mediaMeta = (meta / 2);

    if (monto >= meta) {
      return this.SEMAFORO_VERDE;
    }
    if (monto >= mediaMeta) {
      return this.SEMAFORO_AMARILLO;
    }
    if (monto < mediaMeta) {
      return this.SEMAFORO_ROJO;
    }
    return '';
  }

  private static simplificaNumero(numero: number): number {
    if (numero >= 1000 && numero < 1000000) {
      return Number((numero / 1000).toFixed(2));
    }

    if (numero >= 1000000) {
      return Number((numero / 1000000).toFixed(2));
    }

    return 0;
  }

  private static mostrarSufijoNumeroEnLetras(numero: number): string {
    let texto = '';

    if (numero >= 1000 && numero < 1000000) {
      texto = 'mil';
    }

    if (numero >= 1000000) {
      texto = 'millón';
    }

    return texto;
  }

}


