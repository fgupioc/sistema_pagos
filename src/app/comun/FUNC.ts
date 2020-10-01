import {isNullOrUndefined} from 'util';
import * as moment from 'moment';
import 'moment/locale/es';
import {CONST} from './CONST';

export class FUNC {
  static generateSlug(value: string) {
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
}
