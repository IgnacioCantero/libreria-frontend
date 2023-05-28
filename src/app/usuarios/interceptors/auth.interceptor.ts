import { catchError, Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if (e.status == 403) {
          swal('Acceso denegado', `¡Hola ${this.authService.usuario.username}, no tienes acceso a este recurso!`, 'warning');
          this.router.navigate(['/libros']);
        }
        return throwError(e);
      })
    );
  }

}
