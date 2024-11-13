import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-proveedor',
  templateUrl: './actualizar-proveedor.component.html',
  styleUrls: ['./actualizar-proveedor.component.css']
})
export class ActualizarProveedorComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router) { }

  proveedorId = 0;
  proveedor: any;
  proveedorOriginal: any;

  ngOnInit(): void {
    this.proveedorId = this.route.snapshot.params['proveedorId'];
    this.proveedorService.obtenerProveedor(this.proveedorId).subscribe(
      (data) => {
        this.proveedor = data;
        this.proveedorOriginal = { ...this.proveedor };
        console.log(this.proveedor)
        console.log(this.proveedorOriginal)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volver() {
    this.router.navigate(['/admin/proveedores']); 
  }
  normalizarEspacios(cadena: string): string {
    return cadena.replace(/\s+/g, ' ').trim();
  }
  public actualizarDatos() {
    // Normalizamos espacios en blanco en las cadenas y eliminamos espacios al inicio y al final
    this.proveedor.ruc = this.normalizarEspacios(this.proveedor.ruc);
    this.proveedor.razonSocial = this.normalizarEspacios(this.proveedor.razonSocial);
    
    console.log(this.proveedor);
    
    if (!this.proveedor.ruc || !this.proveedor.razonSocial) {
      this.snack.open('El RUC y la razón social son requeridos', '', {
        duration: 3000
      });
      return;
    }
    
    const nombreModificado = this.proveedor.razonSocial.trim().toLowerCase() !== this.proveedorOriginal.razonSocial.trim().toLowerCase();
    const rucModificado = this.proveedor.ruc.trim().toLowerCase() !== this.proveedorOriginal.ruc.trim().toLowerCase();
    
    // Realizamos la verificación de unicidad solo si algún campo fue modificado
    if (nombreModificado || rucModificado) {
      this.proveedorService.listarProveedores().subscribe(
        (proveedores: any) => {
          const existeNombre = nombreModificado && proveedores.some((proveedor: any) => 
            proveedor.razonSocial.trim().toLowerCase() === this.proveedor.razonSocial.trim().toLowerCase() && proveedor._id !== this.proveedorId
          );
          
          const existeRUC = rucModificado && proveedores.some((proveedor: any) => 
            proveedor.ruc.trim().toLowerCase() === this.proveedor.ruc.trim().toLowerCase() && proveedor._id !== this.proveedorId
          );
          
          if (existeNombre || existeRUC) {
            this.snack.open('Ya existe un proveedor con esos datos', '', {
              duration: 3000
            });
            return;
          }
          
          // Actualizamos el proveedor si no se encontraron duplicados
          this.proveedorService.actualizarProveedor(this.proveedor).subscribe(
            (data) => {
              Swal.fire('Proveedor actualizado', 'El proveedor ha sido actualizado con éxito', 'success').then(
                (e) => {
                  this.router.navigate(['/admin/proveedores']);
                }
              );
            },
            (error) => {
              Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del proveedor', 'error');
              console.log(error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener la lista de proveedores:', error);
          this.snack.open('Error al obtener la lista de proveedores', '', {
            duration: 3000
          });
        }
      );
    } else {
      // Si no hay cambios, igual intentamos la actualización directamente
      this.proveedorService.actualizarProveedor(this.proveedor).subscribe(
        (data) => {
          Swal.fire('Proveedor actualizado', 'El proveedor ha sido actualizado con éxito', 'success').then(
            (e) => {
              this.router.navigate(['/admin/proveedores']);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del proveedor', 'error');
          console.log(error);
        }
      );
    }
  }  
}