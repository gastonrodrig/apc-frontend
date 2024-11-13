import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from 'src/app/services/servicio.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-servicio',
  templateUrl: './actualizar-servicio.component.html',
  styleUrls: ['./actualizar-servicio.component.css']
})
export class ActualizarServicioComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private router: Router) { }

  servicioId = 0;
  servicio: any;
  servicioOriginal: any;

  ngOnInit(): void {
    this.servicioId = this.route.snapshot.params['servicioId'];
    this.servicioService.obtenerServicio(this.servicioId).subscribe(
      (data) => {
        this.servicio = data;
        this.servicioOriginal = { ...this.servicio };
        console.log(this.servicio)
        console.log(this.servicioOriginal)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volver() {
    this.router.navigate(['/admin/servicios']); 
  }
  normalizarEspacios(cadena: string): string {
    return cadena.replace(/\s+/g, ' ').trim();
  }
  
  public actualizarDatos() {
    // Normalizamos espacios en blanco en las cadenas y eliminamos espacios al inicio y al final
    this.servicio.fechaFinGarantia = this.calcularFechaFinGarantia(this.servicio.fechaRealizado, this.servicio.garantia);
    this.servicio.nombre = this.normalizarEspacios(this.servicio.nombre);
    console.log(this.servicio);
    
    if (!this.servicio.nombre || !this.servicio.costo) {
      this.snack.open('El nombre y el costo son requeridos', '', {
        duration: 3000
      });
      return;
    }
    
      this.servicioService.actualizarServicio(this.servicio).subscribe(
        (data) => {
          Swal.fire('servicio actualizado', 'El servicio ha sido actualizado con éxito', 'success').then(
            (e) => {
              this.router.navigate(['/admin/servicios']);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del servicio', 'error');
          console.log(error);
        }
      );
    }

    calcularFechaFinGarantia(fecha: string, garantia: number): string {
      const fechaRealizacion = new Date(fecha);
      fechaRealizacion.setMonth(fechaRealizacion.getMonth() + garantia);
      return fechaRealizacion.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    }
  }
    

