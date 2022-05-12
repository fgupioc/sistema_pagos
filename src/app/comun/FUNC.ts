import {isNullOrUndefined} from 'util';
import * as moment from 'moment';
import 'moment/locale/es';
import {CONST} from './CONST';
import Swal from 'sweetalert2';

export class FUNC {
  static generateSlug(value: any) {
    if (!isNullOrUndefined(value) || value.trim().length > 0) {
      return value.trim().toLowerCase().replace(/\s/g, '-');
    }
  }

  static formatDate(date: string, format?: string) {
    format = format ? format : 'dd-MM-yyyy';
    date = date ? date : '';
    return moment(date).format(format);
  }

  static addDays(date: string, days) {
    const fecha = moment(date).add(days, 'days');
    return fecha.format('YYYY-MM-DD');
  }

  static slugGenerate(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    return str;
  }

  static getNombreLista(etapaActual: string) {
    if (etapaActual == CONST.C_STR_ETAPA_EN_LISTA) {
      return 'En Lista';
    } else if (etapaActual == CONST.C_STR_ETAPA_EN_PROCESO) {
      return 'En Proceso';
    } else if (etapaActual == CONST.C_STR_ETAPA_TERMINADA) {
      return 'Termindada';
    } else {
      return '';
    }
  }

  static getFileExtension(filename: string) {
    // tslint:disable-next-line:no-bitwise
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  static getNamePriority(text: any) {
    if (text == 0) {
      return 'Baja';
    } else if (text == 1) {
      return 'Media';
    } else if (text == 2) {
      return 'Alta';
    } else {
      return '';
    }
  }

  static getClassPriority(text: any) {
    if (text == 1) {
      return 'success';
    } else if (text == 2) {
      return 'danger';
    } else {
      return 'info';
    }
  }

  static getClassBG(index: any) {
    const items = ['bg-default', 'bg-success', 'bg-red', 'bg-yellow', 'bg-info', 'bg-danger-dark', 'bg-orange', 'bg-info-ligth', 'bg-brown', 'bg-brown-ligth'];
    return items[index];
  }

  static formatCurrency(value: any, toFixed = 2) {
    return (value).toFixed(toFixed).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  static recortarString(value: string, cantidad: number): string {
    if (isNullOrUndefined(value)) {
      return '';
    }
    return value.slice(0, cantidad).trim() + (value.trim().length > cantidad ? '...' : '');
  }

  static condicionDesc(value: any) {
    return value == 0 ? 'Sin Condición' : 'Con Condición';
  }

  static estadoDesc(value: any) {

    switch (value) {
      case '1':
        return 'VIGENTE';
      case '2':
        return 'VENCIDO-CUOTAS';
      case '5':
        return 'VENCIDO-SALDO';
      default:
        return '';
    }
  }
}
