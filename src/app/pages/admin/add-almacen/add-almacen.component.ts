import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlmacenService } from 'src/app/services/almacen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-almacen',
  templateUrl: './add-almacen.component.html',
  styleUrls: ['./add-almacen.component.css']
})
export class AddAlmacenComponent implements OnInit {

  almacenData = {
    descripcion: '',
    direccion: '',
    dateCreated: '',
    status: 0
  };

  constructor(
    private snack: MatSnackBar,
    private almacenService: AlmacenService,
    private router: Router) { }
  ngOnInit(): void {

  }
  volver() {
    this.router.navigate(['/admin/almacenes']); 
  }
  guardarInformacion() {
    console.log(this.almacenData);
    if (this.almacenData.direccion.trim() === '' || this.almacenData.direccion == null) {
      this.snack.open('La dirección es requerida', '', {
        duration: 3000
      });
      return;
    }
  
    if (this.almacenData.descripcion.trim() === '' || this.almacenData.descripcion == null) {
      this.snack.open('La descripción es requerida', '', {
        duration: 3000
      });
      return;
    }

    // Obtener la fecha actual
    this.almacenData.dateCreated = this.getCurrentDate();
    this.almacenData.status = 1; // Establecer el estado como 'Activo'

    // Continuar con el resto del código para guardar la categoría
    this.almacenService.listarAlmacenes().subscribe(
      (almacenes: any) => {
        const existeDescripcion = almacenes.some((almacen: any) => almacen.descripcion.trim().toLowerCase() === this.almacenData.descripcion.trim().toLowerCase());
        const existeDireccion = almacenes.some((almacen: any) => almacen.direccion.trim().toLowerCase() === this.almacenData.direccion.trim().toLowerCase());
        if (existeDescripcion || existeDireccion) {
          this.snack.open('Ya existe un almacén con esos datos', '', {
            duration: 3000
          });
        } else {
          this.almacenService.agregarAlmacen(this.almacenData).subscribe(
            (data) => {
              console.log(data);
              Swal.fire({
                title: 'Almacén guardado',
                text: 'El almacén ha sido guardado con exito',
                icon: 'success',
                confirmButtonColor: '#00CED1',
                confirmButtonText: 'Ok',
              });
              this.almacenData = { // Reiniciar los datos después de guardar
                descripcion: '',
                direccion: '',
                dateCreated: '',
                status: 0
              };
              this.router.navigate(['/admin/almacenes']);
            },
            (error) => {
              Swal.fire('Error', 'Error al guardar la información del almacén', 'error');
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener la lista de almacenes:', error);
        this.snack.open('Error al obtener la lista de almacenes', '', {
          duration: 3000
        });
      }
    );
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}