import {isNullOrUndefined} from 'util';
import * as moment from 'moment';
import 'moment/locale/es';

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
}
