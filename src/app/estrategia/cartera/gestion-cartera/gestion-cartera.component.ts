import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Cartera} from '../../../interfaces/cartera';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CarteraService} from '../../../servicios/estrategia/cartera.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {MaestroService} from '../../../servicios/sistema/maestro.service';
import Swal from 'sweetalert2';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-gestion-cartera',
  templateUrl: './gestion-cartera.component.html',
  styleUrls: ['./gestion-cartera.component.css']
})
export class GestionCarteraComponent implements OnInit {
  formGestion: FormGroup;
  cartera: Cartera;
  create = true;
  gestiones: any[] = [];
  gestion;
  $etapas: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carteraService: CarteraService,
    public router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    const data = router.getCurrentNavigation().extras.state;
    if (data && data.cartera) {
      this.cartera = data.cartera;
      this.create = data.update || true;
    } else {
      router.navigateByUrl('/auth/estrategia/carteras');
    }
  }

  ngOnInit() {
    this.listarGestiones();
    this.formGestion = this.formBuilder.group({
      codGestion: [''],
      desde: ['', [Validators.required]],
      hasta: ['', [Validators.required]],
      fechaCreacion: [{value: '', disabled: true}],
      fechaActualizacion: [{value: '', disabled: true}],
      userCreate: [{value: '', disabled: true}],
      userUpdate: [{value: '', disabled: true}],
      etapas: [],
      codEtapaTemp: [],
      desdeTemp: [],
      hastaTemp: [],
    });

    if (!this.gestion) {
      this.formGestion.controls.desde.disable();
      this.formGestion.controls.hasta.disable();
    }
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

  listarGestiones() {
    this.spinner.show();
    this.carteraService.getGestiones().subscribe(
      response => {
        if (response.exito) {
          this.gestiones = response.objeto;
        }
        this.spinner.hide();
      }
    );
  }

  selectedGestion(event: any) {
    if (event) {
      const temp = this.cartera.carteraGestions.find(c => c.codGestion == event);
      if (temp) {
        this.formGestion.controls.codGestion.setValue('');
        this.toastr.warning('Ya tiene la gestion asignada a la cartera');
        return;
      }
      const gestion = this.gestiones.find(i => i.codGestion == event);
      if (gestion) {
        this.gestion = Object.assign({}, gestion);
        this.formGestion.controls.desde.enable();
        this.formGestion.controls.hasta.enable();
        this.formGestion.controls.desde.setValue(this.gestion.desde);
        this.formGestion.controls.hasta.setValue(this.gestion.hasta);
      }
    }
  }

  selectedEtapa(event: any) {
    const val = event.target.value;
    if (val) {
      const etapa = this.gestion.etapas.find(i => i.codEtapa == val);
      this.formGestion.controls.desdeTemp.setValue(etapa.desde);
      this.formGestion.controls.hastaTemp.setValue(etapa.hasta);
    }
  }

  addEtapa() {
    if (isNullOrUndefined(this.formGestion.controls.desdeTemp.value) || isNullOrUndefined(this.formGestion.controls.hastaTemp.value)) {
      return;
    }
    this.formGestion.controls.codGestion.disable();
    this.formGestion.controls.desde.disable();
    this.formGestion.controls.hasta.disable();
    const index = this.$etapas.findIndex(i => i.codEtapa == this.formGestion.controls.codEtapaTemp.value);
    if (index >= 0) {
      this.$etapas[index].desde = this.formGestion.controls.desdeTemp.value;
      this.$etapas[index].hasta = this.formGestion.controls.hastaTemp.value;
    } else {
      const item = this.gestion.etapas.find(i => i.codEtapa == this.formGestion.controls.codEtapaTemp.value);
      const etapa = Object.assign({}, item);
      if (etapa) {
        etapa.desde = this.formGestion.controls.desdeTemp.value;
        etapa.hasta = this.formGestion.controls.hastaTemp.value;
        this.$etapas.push(etapa);
      }
    }
    this.$etapas = this.$etapas.sort((a, b) => (a.codEtapa > b.codEtapa) ? 1 : ((b.codEtapa > a.codEtapa) ? -1 : 0));
    this.formGestion.controls.codEtapaTemp.setValue(null);
    this.formGestion.controls.desdeTemp.setValue(null);
    this.formGestion.controls.hastaTemp.setValue(null);
  }

  removeEtapa(codEtapa: any) {
    this.$etapas = this.$etapas.filter(i => i.codEtapa != codEtapa);
    if (this.$etapas.length == 0) {
      this.formGestion.controls.desde.enable();
      this.formGestion.controls.hasta.enable();
    }
  }

  agregar() {
    if (this.$etapas.length == 0) {
      this.toastr.warning('Debe ingresar al menos una etapa');
      return;
    }
    const gestion = Object.assign({}, this.gestion);
    const etapas = this.$etapas;
    gestion.desde = Number(this.formGestion.controls.desde.value);
    gestion.hasta = Number(this.formGestion.controls.hasta.value);
    gestion.etapas = etapas;

    this.spinner.show();
    this.carteraService.agregarGestionCartera(gestion, this.cartera.codCartera).subscribe(
      res => {
        if (res.exito) {
          Swal.fire('', res.mensaje, 'success');
        } else {
          Swal.fire('', res.mensaje, 'warning');
        }
        this.spinner.hide();
      },
      err => {
        this.toastr.error('Ocurrio un error en el proceso');
        this.spinner.hide();
      }
    );
  }
}
