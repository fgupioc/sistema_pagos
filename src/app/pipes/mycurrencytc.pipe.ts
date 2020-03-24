import {Pipe, PipeTransform} from '@angular/core'; 
import { CONST } from '../comun/CONST';

const padding = '000000';

@Pipe({
  name: 'mycurrencytc'
})
export class MyCurrencyTCPipe implements PipeTransform {
  private prefix: string;
  private decimalSeparator: string;
  private thousandsSeparator: string;
  private suffix: string;

  constructor() {
    this.prefix = '';
    this.suffix = '';
    this.decimalSeparator = '.';
    this.thousandsSeparator = ',';
  }

  transform(
    value: string,
    fractionSize: number = CONST.C_INT_CANTIDAD_NUMEROS_DECIMALES_MONEDA,
    prefixCurrency: string = ''): string {

    this.prefix = prefixCurrency;

    if (parseFloat(value) % 1 != 0) {
      fractionSize = 6;
    }
    let [integer, fraction = ''] = (parseFloat(value).toString() || '').toString().split('.');

    fraction = fractionSize > 0
      ? this.decimalSeparator + (fraction + padding).substring(0, fractionSize) : '';
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    if (isNaN(parseFloat(integer))) {
      integer = '0';
    }
    return this.prefix + integer + fraction + this.suffix;

  }

  parse(value: string, fractionSize: number = CONST.C_INT_CANTIDAD_NUMEROS_DECIMALES_MONEDA): string {
    let [integer, fraction = ''] = (value || '').replace(this.prefix, '')
      .replace(this.suffix, '')
      .split(this.decimalSeparator);

    integer = integer.replace(new RegExp(this.thousandsSeparator, 'g'), '');

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.decimalSeparator + (fraction + padding).substring(0, fractionSize)
      : '';

    return integer + fraction;
  }

}
