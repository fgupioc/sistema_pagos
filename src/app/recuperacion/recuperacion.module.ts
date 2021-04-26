import { ComponentesModule } from './../componentes/componentes.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ComunModule } from '../comun/comun.module';
import { NgbTooltipModule, NgbModalModule, NgbNavModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { MyPipesModule } from '../pipes/my-pipes.module';
import { Select2Module } from 'ng2-select2';
import { ExtrajudicialCarterasComponent } from './extrajudicial/extrajudicial-carteras/extrajudicial-carteras.component';
import { JudicialCarterasComponent } from './judicial/judicial-carteras/judicial-carteras.component';
import { ExtrajudicialSolicitudCambioEstadoComponent } from './extrajudicial/extrajudicial-solicitud-cambio-estado/extrajudicial-solicitud-cambio-estado.component';
import {RouterModule} from '@angular/router';
import {TreeviewModule} from 'ngx-treeview';
import { ExtrajudicialSocioComponent } from './extrajudicial/extrajudicial-socio/extrajudicial-socio.component';
import { QuillModule } from 'ngx-quill';
import { GestionSocioRegistrarComponent } from './extrajudicial/componentes/gestion/gestion-socio-registrar/gestion-socio-registrar.component';

@NgModule({
  declarations: [
    ExtrajudicialCarterasComponent,
    JudicialCarterasComponent,
    ExtrajudicialSolicitudCambioEstadoComponent,
    ExtrajudicialSocioComponent,
    GestionSocioRegistrarComponent
  ],
  imports: [
    CommonModule,
    ComunModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbNavModule,
    ReactiveFormsModule,

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added

    TreeviewModule.forRoot(),
    DataTablesModule,
    MyPipesModule,


    FormsModule,
    ComponentesModule,
    NgbModule,
    Select2Module,
    RouterModule,
    QuillModule.forRoot()
  ],
  entryComponents: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
  ]
})
export class RecuperacionModule {
}
