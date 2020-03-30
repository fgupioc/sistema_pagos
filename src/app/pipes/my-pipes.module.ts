import {NgModule} from '@angular/core';
import {MyCurrencyPipe} from './mycurrency.pipe';
import {MyIntegerDirective} from './integer.directive';
import {MyCurrencyDirective} from './currency.directive';
import {UppercaseDirective} from './uppercase-directive';
import {NumberDirective} from './number.directive';
import {SoloLetrasDirective} from './solo-letras.directive';
import { MyCurrencyMoneyDirective } from './currency-money';
import { MyCurrencyTCPipe } from './mycurrencytc.pipe';
import { ArrayDiasDirective } from './array-dias';


@NgModule({
  declarations: [
    NumberDirective,
    MyCurrencyPipe,
    MyIntegerDirective,
    MyCurrencyDirective,
    UppercaseDirective,
    SoloLetrasDirective,
    MyCurrencyTCPipe,
    MyCurrencyMoneyDirective,
    ArrayDiasDirective
  ],
  providers: [
    MyCurrencyPipe,
    MyCurrencyTCPipe,
  ],
  exports: [
    NumberDirective,
    MyIntegerDirective,
    MyCurrencyDirective,
    MyCurrencyPipe,
    UppercaseDirective,
    SoloLetrasDirective,
    MyCurrencyTCPipe,
    MyCurrencyMoneyDirective,
    ArrayDiasDirective
  ]
})
export class MyPipesModule {
}
