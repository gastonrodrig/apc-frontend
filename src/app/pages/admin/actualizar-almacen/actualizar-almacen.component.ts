import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlmacenService } from 'src/app/services/almacen.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-almacen',
  templateUrl: './actualizar-almacen.component.html',
  styleUrls: ['./actualizar-almacen.component.css']
})
export class ActualizarAlmacenComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private almacenService: AlmacenService,
    private router: Router) { }

  almacenId = 0;
  almacen: any;
  almacenOriginal: any;

  ngOnInit(): void {
    this.almacenId = this.route.snapshot.params['almacenId'];
    this.almacenService.obtenerAlmacen(this.almacenId).subscribe(
      (data) => {
        this.almacen = data;
        this.almacenOriginal = { ...this.almacen };
        console.log(this.almacen)
        console.log(this.almacenOriginal)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volver() {
    this.router.navigate(['/admin/almacenes']); 
  }
  normalizarEspacios(cadena: string): string {
    return cadena.replace(/\s+/g, ' ').trim();
  }
  public actualizarDatos() {
    // Normalizamos espacios en blanco en las cadenas y eliminamos espacios al inicio y al final
    this.almacen.direccion = this.normalizarEspacios(this.almacen.direccion);
    this.almacen.descripcion = this.normalizarEspacios(this.almacen.descripcion);
    
    console.log(this.almacen);
    
    if (!this.almacen.direccion || !this.almacen.descripcion) {
      this.snack.open('Los datos son requeridos', '', {
        duration: 3000
      });
      return;
    }
    
    const direccionModificado = this.almacen.direccion.trim().toLowerCase() !== this.almacenOriginal.direccion.trim().toLowerCase();
    const descripcionModificado = this.almacen.descripcion.trim().toLowerCase() !== this.almacenOriginal.descripcion.trim().toLowerCase();
    
    // Realizamos la verificación de unicidad solo si algún campo fue modificado
    if (direccionModificado || descripcionModificado) {
      this.almacenService.listarAlmacenes().subscribe(
        (almacenes: any) => {
          const existeDireccion = direccionModificado && almacenes.some((almacen: any) => 
            almacen.direccion.trim().toLowerCase() === this.almacen.direccion.trim().toLowerCase() && almacen._id !== this.almacenId
          );
          
          const existeDescripcion = descripcionModificado && almacenes.some((almacen: any) => 
            almacen.descripcion.trim().toLowerCase() === this.almacen.descripcion.trim().toLowerCase() && almacen._id !== this.almacenId
          );
          
          if (existeDireccion || existeDescripcion) {
            this.snack.open('Ya existe un almacén con esos datos', '', {
              duration: 3000
            });
            return;
          }
          
          // Actualizamos el almacén si no se encontraron duplicados
          this.almacenService.actualizarAlmacen(this.almacen).subscribe(
            (data) => {
              Swal.fire('Almacén actualizado', 'El almacén ha sido actualizado con éxito', 'success').then(
                (e) => {
                  this.router.navigate(['/admin/almacenes']);
                }
              );
            },
            (error) => {
              Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del almacén', 'error');
              console.log(error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener la lista de almacenes:', error);
          this.snack.open('Error al obtener la lista de almacenes', '', {
            duration: 3000
          });
        }
      );
    } else {
      // Si no hay cambios, igual intentamos la actualización directamente
      this.almacenService.actualizarAlmacen(this.almacen).subscribe(
        (data) => {
          Swal.fire('Almacén actualizado', 'El almacén ha sido actualizado con éxito', 'success').then(
            (e) => {
              this.router.navigate(['/admin/almacenes']);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del almacén', 'error');
          console.log(error);
        }
      );
    }
  }
}