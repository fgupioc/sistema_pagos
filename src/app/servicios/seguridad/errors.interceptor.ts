import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class ErrorsInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status == 401) {
          Swal.fire('', 'No tiene autorización para este servicio.', 'warning');
          this.router.navigateByUrl('/auth/dashboard');
        }
        this.spinner.hide();
        return throwError(error);
      })
    );
  }
}
