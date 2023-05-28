import { Component, Input, OnInit } from '@angular/core';
import { Libro } from "../libro";
import { LibroService } from "../libro.service";
import { HttpEventType } from "@angular/common/http";
import { ModalService } from "./modal.service";
import { AuthService } from "../../usuarios/auth.service";
import swal from "sweetalert2";

@Component({
  selector: 'detalle-libro',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() libro: Libro;
  public fotoSeleccionada: any;
  progreso: number = 0;

  constructor(private libroService: LibroService,
              public modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit(): void { }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error al seleccionar imagen!', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal('Error Upload!', 'Debe seleccionar una foto', 'error');
    } else {
      this.libroService.subirFoto(this.fotoSeleccionada, this.libro.id).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded/event.total)*100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.libro = response.libro as Libro;
            this.modalService.notificarUpload.emit(this.libro); //Cargar la foto en miniatura del libro si es nueva
            swal('Foto subida correctamente', response.mensaje, 'success');
          }
      });
    }
  }

  //Cerrar modal detalle libro:
  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
