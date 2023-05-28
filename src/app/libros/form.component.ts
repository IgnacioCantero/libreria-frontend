import { Component, OnInit } from '@angular/core';
import { Libro } from "./libro";
import { LibroService } from "./libro.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  libro: Libro = new Libro;
  errores: string[];

  constructor(private libroService: LibroService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //Cargar datos del libro cuando se clicke en 'Editar':
    this.cargarLibro();
  }

  //Cargar datos libros:
  cargarLibro(): void {
    this.activatedRoute.params
      .subscribe(params => {
          let id = params['id']
          if (id) {
            this.libroService.getLibro(id).subscribe((libro) => this.libro = libro);
          }
        }
      )
  }

  //Crear libro:
  create() {
    console.log(this.libro);
    this.libroService.create(this.libro)
      .subscribe({
        next:
          libro=> {
            this.router.navigate(['/libros']);
            swal('Nuevo libro', `Libro '${this.libro.titulo}' de '${this.libro.autor}' creado con éxito!`, 'success');
          },
        error: () => {
              this.errores = this.libroService.getErrores();
            }
      });
  }

  //Editar libro:
  update(): void {
    console.log(this.libro);
    this.libroService.update(this.libro)
      .subscribe({
        next:
          libro => {
            this.router.navigate(['/libros']);
            swal('Libro actualizado', `Libro '${this.libro.titulo}' de '${this.libro.autor}' actualizado con éxito!`, 'success');
          },
        error:
          err => {
            this.errores = err.error.errors as string[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err.error.errors);
          }
      });
  }

  //Cancelar:
  return() {
    this.router.navigate(['/libros']);
  }

}
