import { Component, OnInit } from '@angular/core';
import { Libro } from "./libro";
import { LibroService } from "./libro.service";
import { ActivatedRoute } from "@angular/router";
import { ModalService } from "./detalle/modal.service";
import { AuthService } from "../usuarios/auth.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css']
})
export class LibrosComponent implements OnInit {

  libros: Libro[] = [];
  paginador: any;
  libroSeleccionado: Libro;

  constructor(private libroService: LibroService,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit() {
    //Mostrar libros paginados y ordenados:
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page'); //Operador '+' -> convertir el parámetro 'page' a un number
      if (!page){
        page = 0;
      }
      this.libroService.getLibros(page)
        .subscribe(response => {
          this.libros = response.content as Libro[];
          this.paginador = response;
        });
    });

    //Cargar la foto en miniatura del libro si es nueva:
    this.modalService.notificarUpload.subscribe(libro => {
      this.libros = this.libros.map(libroOriginal => {
        if (libro.id == libroOriginal.id) {
          libroOriginal.foto = libro.foto;
        }
        return libroOriginal;
      })
    });
  }

  //Borrar libro:
  delete(libro: Libro): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar el libro '${libro.titulo}'?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.libroService.delete(libro.id).subscribe(
          response => {
            this.libros = this.libros.filter(cli => cli != libro)
            swal(
              'Libro eliminado!',
              `Libro '${libro.titulo}' eliminado con éxito`,
              'success'
            )
          }
        )
      }
    })
  }

  //Abrir modal detalle libro:
  abrirModal(libro: Libro) {
    this.libroSeleccionado = libro;
    this.modalService.abrirModal();
  }

}
