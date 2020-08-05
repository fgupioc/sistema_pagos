import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioService} from '../../servicios/sistema/usuario.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CONST} from '../../comun/CONST';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {AuthorityService} from '../../servicios/authority.service';
import {Autorizacion} from '../../comun/autorzacion';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  public A = Autorizacion;
  usuarios: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized = false;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;

  constructor(private usuarioService: UsuarioService, private spinner: NgxSpinnerService, private modalService: NgbModal,
              private router: Router, private AS: AuthorityService) {
  }

  ngOnInit() {
    this.dtOptions = CONST.DATATABLE_ES();
    if (this.AS.has(this.A.USUARIO_LISTAR)) {
      this.encuentraTodos();
    }
  }

  encuentraTodos() {
    this.spinner.show();
    this.usuarioService.encuentraTodos().subscribe(
      res => {
        this.spinner.hide();
        this.usuarios = res;
        this.refreshDatatable();
      });
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
    this.router.navigate(['/auth/seguridad/usuario/crear']);
  }

  editar(usuarioId: number) {
    this.router.navigateByUrl('/auth/seguridad/usuario/editar', {state: {usuarioId}});
  }


  estaActivo(codEstado: string) {
    return codEstado === CONST.S_ESTADO_REG_ACTIVO;
  }

  actualizarContrasenha(usuario: any) {
    this.router.navigateByUrl('/auth/seguridad/usuario/contrasenha', {state: {usuarioId: usuario.id, alias: usuario.alias}});
  }
}
