import { catchError, map, Observable, throwError } from "rxjs";
import { Injectable } from '@angular/core';
import { Libro } from "./libro";
import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class LibroService {

  private urlEndPoint: string = 'http://localhost:8080/api/libros';
  errores: string[] = [];

  constructor(private http: HttpClient,
              private router: Router) { }

  getErrores(): string[] {
    return this.errores;
  }

  //Mostrar libros paginados y ordenados:
  getLibros(page: number): Observable<any> {
    // @ts-ignore
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Libro[]).map(libro => {
          libro.titulo = libro.titulo.toUpperCase();
          return libro;
        });
        return response;
      })
    );
  }

  //Mostrar libro por id:
  getLibro(id: number | undefined): Observable<Libro> {
    return this.http.get<Libro>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/libros']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  //Crear libro:
  create(libro: Libro): Observable<Libro> {
    // @ts-ignore
    return this.http.post<Libro>(this.urlEndPoint, libro).pipe(
      catchError(e => {
        if (e.status == 400) {
          this.errores = e.error.errors as string[];
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  //Editar libro:
  update(libro: Libro): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${libro.id}`, libro).pipe(
      catchError(e => {
        if (e.status == 400) {
          this.errores = e.error.errors as string[];
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  //Borrar libro:
  delete(id: number | undefined): Observable<Libro> {
    // @ts-ignore
    return this.http.delete<Libro>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  //Subir foto libro:
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }

}
