import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from './loading/loading.component';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    NgxSpinnerModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    LoadingComponent
  ]
})
export class ComunModule {
}
