import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-cliente',
  templateUrl: './actualizar-cliente.component.html',
  styleUrls: ['./actualizar-cliente.component.css']
})
export class ActualizarClienteComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router) { }

  clienteId = 0;
  cliente: any;
  clienteOriginal: any;

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.params['clienteId'];
    this.clienteService.obtenerCliente(this.clienteId).subscribe(
      (data) => {
        this.cliente = data;
        this.clienteOriginal = { ...this.cliente };
        console.log(this.cliente)
        console.log(this.clienteOriginal)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volver() {
    this.router.navigate(['/admin/clientes']); 
  }
  normalizarEspacios(cadena: string): string {
    return cadena.replace(/\s+/g, ' ').trim();
  }
  public actualizarDatos() {
    // Normalizamos espacios en blanco en las cadenas y eliminamos espacios al inicio y al final
    this.cliente.ruc = this.normalizarEspacios(this.cliente.ruc);
    this.cliente.razonSocial = this.normalizarEspacios(this.cliente.razonSocial);
    
    console.log(this.cliente);
    
    if (!this.cliente.ruc || !this.cliente.razonSocial) {
      this.snack.open('El RUC y la razón social son requeridos', '', {
        duration: 3000
      });
      return;
    }
    
    const nombreModificado = this.cliente.razonSocial.trim().toLowerCase() !== this.clienteOriginal.razonSocial.trim().toLowerCase();
    const rucModificado = this.cliente.ruc.trim().toLowerCase() !== this.clienteOriginal.ruc.trim().toLowerCase();
    
    // Realizamos la verificación de unicidad solo si algún campo fue modificado
    if (nombreModificado || rucModificado) {
      this.clienteService.listarClientes().subscribe(
        (clientes: any) => {
          const existeNombre = nombreModificado && clientes.some((cliente: any) => 
            cliente.razonSocial.trim().toLowerCase() === this.cliente.razonSocial.trim().toLowerCase() && cliente._id !== this.clienteId
          );
          
          const existeRUC = rucModificado && clientes.some((cliente: any) => 
            cliente.ruc.trim().toLowerCase() === this.cliente.ruc.trim().toLowerCase() && cliente._id !== this.clienteId
          );
          
          if (existeNombre || existeRUC) {
            this.snack.open('Ya existe un cliente con esos datos', '', {
              duration: 3000
            });
            return;
          }
          
          // Actualizamos el cliente si no se encontraron duplicados
          this.clienteService.actualizarCliente(this.cliente).subscribe(
            (data) => {
              Swal.fire('Cliente actualizado', 'El cliente ha sido actualizado con éxito', 'success').then(
                (e) => {
                  this.router.navigate(['/admin/clientes']);
                }
              );
            },
            (error) => {
              Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del cliente', 'error');
              console.log(error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener la lista de clientes:', error);
          this.snack.open('Error al obtener la lista de clientes', '', {
            duration: 3000
          });
        }
      );
    } else {
      // Si no hay cambios, igual intentamos la actualización directamente
      this.clienteService.actualizarCliente(this.cliente).subscribe(
        (data) => {
          Swal.fire('Cliente actualizado', 'El cliente ha sido actualizado con éxito', 'success').then(
            (e) => {
              this.router.navigate(['/admin/clientes']);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del cliente', 'error');
          console.log(error);
        }
      );
    }
  }  
}