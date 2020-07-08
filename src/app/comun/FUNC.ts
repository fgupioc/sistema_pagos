import {isNullOrUndefined} from 'util';

export class FUNC {
  static generateSlug(value: string) {
    if (!isNullOrUndefined(value) || value.trim().length > 0) {
      return value.trim().toLowerCase().replace(/\s/g, '-');
    }
  }
}
