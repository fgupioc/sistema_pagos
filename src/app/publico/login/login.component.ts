import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AutenticacionService} from '../../servicios/seguridad/autenticacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  errMessage = '';
  private loadingSubject: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;

  constructor(private formBuilder: FormBuilder, private autenticacionService: AutenticacionService, private router: Router) {
    this.formGroup = this.formBuilder.group({
      email: ['', {
        validators: [
          Validators.required, Validators.email,
          // Validators.pattern(AppConstante.C_STR_EXP_REGULAR_EMAIL)
        ]
      }],
      password: ['', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          // Validators.pattern(AppConstante.C_STR_EXP_REGULAR_CLAVE_USUARIO)
        ]
      }],
    });
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {

  }

  login() {
    const correo = this.formGroup.get('email').value;
    const clave = this.formGroup.get('password').value;
    this.loadingSubject.next(true);
    this.autenticacionService.login(correo, clave)
      .then(
        () => {
          this.loadingSubject.next(false);
          this.router.navigate(['/auth/dashboard']);
        },
        error => {
          if (error.error.error === 'invalid_grant' || error.error.error === 'unauthorized') {
            this.formGroup.get('email').setErrors({
              incorrect: true,
              validate: true
            });
            this.formGroup.updateValueAndValidity();
          }

          this.loadingSubject.next(false);
        });
  }

}
