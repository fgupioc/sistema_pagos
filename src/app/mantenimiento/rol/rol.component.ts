import {Component, OnInit, ViewChild} from '@angular/core';
import {CONST} from '../../comun/CONST';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {Autorizacion} from '../../comun/autorzacion';
import {RolService} from '../../servicios/rol.service';
import {AuthorityService} from '../../servicios/authority.service';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  public A = Autorizacion;
  roles: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(private rolService: RolService,
              private spinner: NgxSpinnerService,
              private router: Router,
              public AS: AuthorityService) {
  }

  ngOnInit() {
    this.dtOptions = CONST.C_OBJ_DT_OPCIONES();
    this.encuentraTodos();
    if (this.AS.has(this.A.ROL_LISTAR)) {
      this.encuentraTodos();
    }
  }

  encuentraTodos() {
    this.spinner.show();
    this.rolService.encuentraTodos().subscribe(
      (res: any[]) => {
        this.spinner.hide();
        this.roles = res;
        this.refreshDatatable();
      }, error => this.spinner.hide());
  }

  refreshDatatable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }

  crear() {
    this.router.navigate(['/auth/mantenimiento/rol/crear']);
  }

  editar(rolId: number) {
    this.router.navigateByUrl('/auth/mantenimiento/rol/editar', {state: {rolId}});
  }

  estaActivo(codEstado: string) {
    return codEstado === CONST.S_ESTADO_REG_ACTIVO;
  }

}
