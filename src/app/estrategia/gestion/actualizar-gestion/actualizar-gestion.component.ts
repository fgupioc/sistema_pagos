import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {ActualizarEtapaComponent} from '../../etapa/actualizar-etapa/actualizar-etapa.component';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';
import {isNullOrUndefined} from 'util';
import {CONST} from '../../../comun/CONST';
import {NgxSpinnerService} from 'ngx-spinner';
import {Cartera} from '../../../interfaces/cartera';
import {TablaMaestra} from '../../../interfaces/tabla-maestra';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import {FUNC} from '../../../comun/FUNC';

declare var $: any;

@Component({
  selector: 'app-actualizar-gestion',
  templateUrl: './actualizar-gestion.component.html',
  styleUrls: ['./actualizar-gestion.component.css']
})
export class ActualizarGestionComponent implements OnInit {
  formGestion: FormGroup;
  etapas: any[] = [];
  gestion: any;
  create: boolean;
  gestiones: any[] = [];
  cartera: Cartera;
  areas: TablaMaestra[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public modalService: NgbModal,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private maestroService: MaestroService
  ) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      if (this.router.getCurrentNavigation().extras.state.create) {
        this.create = true;
        this.cartera = this.router.getCurrentNavigation().extras.state.cartera;
      } else {
        this.gestion = this.router.getCurrentNavigation().extras.state.gestion;
        this.cartera = this.router.getCurrentNavigation().extras.state.cartera;
        this.create = false;
      }
      this.gestiones = this.router.getCurrentNavigation().extras.state.gestiones;
    } else {
      this.router.navigate(['/auth/estrategia/carteras']);
    }
  }

  ngOnInit() {

    this.loadAreas();

    this.formGestion = this.formBuilder.group({
      codGestion: [''],
      codCartera: [''],
      nombre: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      desde: ['', [Validators.required]],
      hasta: ['', [Validators.required]],
      codArea: ['', [Validators.required]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      estado: [''],
      etapas: [null],
      color: []
    });

    if (!this.create) {
      this.formGestion.setValue(this.gestion);
      this.formGestion.controls.fechaCreacion.setValue(FUNC.formatDate(this.gestion.fechaCreacion, 'd MMMM yy h:mm a'));
      this.formGestion.controls.fechaActualizacion.setValue(FUNC.formatDate(this.gestion.fechaActualizacion, 'd MMMM yy h:mm a'));
      this.etapas = this.gestion.etapas;
    }
    if (this.cartera) {
      this.formGestion.controls.codCartera.setValue(this.cartera.codCartera);
    }
  }

  guardar() {
    const data: any = this.formGestion.getRawValue();
    if (this.etapas.length === 0) {
      Swal.fire('Nueva Gestion', 'Se necesita registrar etapas', 'error');
      return;
    }
    const hasta = Number(this.formGestion.controls.hasta.value);
    if (Number(this.etapas[this.etapas.length - 1].hasta) !== hasta) {
      Swal.fire('Nueva Gestion', 'La estapas deben de cubrir todo el rango de los campos desde y hasta.', 'error');
      return;
    }

    data.etapas = this.etapas;
    this.spinner.show();
    this.carteraService.crearGestion(data).subscribe(
      response => {
        if (response.exito) {
          this.toastr.success('Se registro con exito.');
          this.router.navigateByUrl('/auth/estrategia/carteras/detalle', {state: {cartera: this.cartera}});
        } else {
          Swal.fire('Registro', response.mensaje, 'error');
        }
        this.spinner.hide();
      }
    );
  }

  actualizar() {
    const data: any = this.formGestion.getRawValue();
    const c = this.etapas.filter(value => value.estado == '1');
    if (c.length === 0) {
      alert('Se necesita registrar etapas');
      return;
    }

    const hasta = Number(this.formGestion.controls.hasta.value);
    if (Number(c[c.length - 1].hasta) !== hasta) {
      Swal.fire('Nueva Gestion', 'La estapas deben de cubrir todo el rango de los campos desde y hasta.', 'error');
      return;
    }
    data.etapas = this.etapas;
    this.spinner.show();
    this.carteraService.actualizarGestion(data).subscribe(
      response => {
        if (response.exito) {
          this.toastr.success('Se actualizo con exito.');
          this.router.navigate(['/auth/estrategia/carteras']);
        } else {
          Swal.fire('Registro', response.mensaje, 'error');
        }
        this.spinner.hide();
      }
    );
  }

  nuevaEtapa() {
    const modal = this.modalService.open(ActualizarEtapaComponent, {size: 'lg'});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.etapas = this.etapas;
    modal.componentInstance.gestion = this.formGestion.getRawValue();
  }

  actualzarEtapa(i) {
    const modal = this.modalService.open(ActualizarEtapaComponent, {size: 'lg'});
    modal.result.then(
      this.closeModal.bind(this),
      this.closeModal.bind(this)
    );
    modal.componentInstance.etapas = this.etapas;
    modal.componentInstance.index = i;
    modal.componentInstance.create = false;
    modal.componentInstance.gestion = this.formGestion.getRawValue();
  }

  closeModal(data) {
  }

  eliminar(item, i) {
    Swal.fire({
      title: 'Estas segura?',
      text: 'Eliminar etapa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (isNullOrUndefined(item.codEtapa)) {
          this.etapas.splice(i, 1);
        } else {
          this.etapas[i].estado = CONST.S_ESTADO_REG_INACTIVO;
        }

        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        );
      }
    });
  }

  validarDesde() {
    this.formGestion.controls.hasta.setValue(0);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.create) {
      if (this.gestiones.length > 0) {
        let flag = true;
        this.gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestion', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(0);
          return;
        }
      }
    } else {
      const gestiones = this.gestiones.filter(v => v.codGestion < this.gestion.codGestion);
      if (gestiones.length > 0) {
        let flag = true;
        gestiones.forEach(v => {
          if (desde <= v.hasta) {
            flag = false;
          }
        });
        if (!flag) {
          Swal.fire('Crear Gestion', 'La cantidad del campo desde no es valido.', 'error');
          this.formGestion.controls.desde.setValue(this.gestion.desde);
          return;
        }
      }
    }
  }

  validarHasta() {
    const hasta = Number(this.formGestion.controls.hasta.value);
    const desde = Number(this.formGestion.controls.desde.value);
    if (this.create) {
      if (hasta <= desde) {
        Swal.fire('Crear Gestion', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(0);
        return;
      }
    } else {
      if (hasta <= desde) {
        Swal.fire('Crear Gestion', 'La cantidad del campo hasta no es valido.', 'error');
        this.formGestion.controls.hasta.setValue(this.gestion.hasta);
        return;
      }
    }
  }

  cambio(tipo: any) {
    if (tipo == '1') {
      $('.etapas').removeClass('active');
      $('.gestion').addClass('active');
      $('#etapas').removeClass('show active');
      $('#gestion').addClass('show active');
    } else {
      $('.gestion').removeClass('active');
      $('.etapas').addClass('active');
      $('#etapas').addClass('show active');
      $('#gestion').removeClass('show active');
    }
  }

  loadAreas() {
    this.spinner.show();
    this.maestroService.listaTablaAreas().subscribe(
      res => {
        this.areas = res;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
}
