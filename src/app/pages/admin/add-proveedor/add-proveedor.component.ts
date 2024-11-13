import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrls: ['./add-proveedor.component.css']
})
export class AddProveedorComponent implements OnInit {

  proveedorData = {
    ruc: '',
    razonSocial: '',
    dateCreated: '',
    status: 0
  };

  constructor(
    private snack: MatSnackBar,
    private proveedorService: ProveedorService,
    private router: Router) { }
  ngOnInit(): void {

  }
  volverAProveedores() {
    this.router.navigate(['/admin/proveedores']); 
  }
  guardarInformacion() {
    console.log(this.proveedorData);
    if (this.proveedorData.ruc.trim() === '' || this.proveedorData.ruc == null) {
      this.snack.open('El RUC es requerido', '', {
        duration: 3000
      });
      return;
    }
  
    if (this.proveedorData.razonSocial.trim() === '' || this.proveedorData.razonSocial == null) {
      this.snack.open('La Razón Social es requerida', '', {
        duration: 3000
      });
      return;
    }

    // Obtener la fecha actual
    this.proveedorData.dateCreated = this.getCurrentDate();
    this.proveedorData.status = 1; // Establecer el estado como 'Activo'

    // Continuar con el resto del código para guardar la categoría
    this.proveedorService.listarProveedores().subscribe(
      (proveedores: any) => {
        const existeRazonSocial = proveedores.some((proveedor: any) => proveedor.razonSocial.trim().toLowerCase() === this.proveedorData.razonSocial.trim().toLowerCase());
        const existeRUC = proveedores.some((proveedor: any) => proveedor.ruc.trim().toLowerCase() === this.proveedorData.ruc.trim().toLowerCase());
        if (existeRazonSocial || existeRUC) {
          this.snack.open('Ya existe un proveedor con esos datos', '', {
            duration: 3000
          });
        } else {
          this.proveedorService.agregarProveedor(this.proveedorData).subscribe(
            (data) => {
              console.log(data);
              Swal.fire({
                title: 'Proveedor guardado',
                text: 'El proveedor ha sido guardado con exito',
                icon: 'success',
                confirmButtonColor: '#00CED1',
                confirmButtonText: 'Ok',
              });
              this.proveedorData = { // Reiniciar los datos después de guardar
                ruc: '',
                razonSocial: '',
                dateCreated: '',
                status: 0
              };
              this.router.navigate(['/admin/proveedores']);
            },
            (error) => {
              Swal.fire('Error', 'Error al guardar la información del proveedor', 'error');
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener la lista de proveedores:', error);
        this.snack.open('Error al obtener la lista de proveedores', '', {
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