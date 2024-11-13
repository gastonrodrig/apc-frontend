import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/services/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-servicio',
  templateUrl: './add-servicio.component.html',
  styleUrls: ['./add-servicio.component.css']
})
export class AddServicioComponent implements OnInit {

  servicioData = {
    nombre: '',
    descripcion: '',
    costo: 0,
    fechaRealizado: '',
    garantia: 0,
    fechaFinGarantia: '',
    status: 1
  };

  constructor(
    private snack: MatSnackBar,
    private servicioService: ServicioService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  volver() {
    this.router.navigate(['/admin/servicios']); 
  }

  guardarInformacion() {
    console.log(this.servicioData);
    if (this.servicioData.nombre.trim() === '' || this.servicioData.nombre == null) {
      this.snack.open('El nombre es requerido', '', {
        duration: 3000
      });
      return;
    }

    if (this.servicioData.descripcion.trim() === '' || this.servicioData.descripcion == null) {
      this.snack.open('La descripción es requerida', '', {
        duration: 3000
      });
      return;
    }

    if (this.servicioData.costo <= 0) {
      this.snack.open('El costo debe ser mayor que 0', '', {
        duration: 3000
      });
      return;
    }

    // Calcular la fecha de fin de garantía
    this.servicioData.fechaFinGarantia = this.calcularFechaFinGarantia(this.servicioData.fechaRealizado, this.servicioData.garantia);

    // Llamada al servicio para guardar el servicio
    this.servicioService.agregarServicio(this.servicioData).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          title: 'Servicio guardado',
          text: 'El servicio ha sido guardado con éxito',
          icon: 'success',
          confirmButtonColor: '#00CED1',
          confirmButtonText: 'Ok',
        });
        this.servicioData = {  // Reiniciar los datos después de guardar
          nombre: '',
          descripcion: '',
          costo: 0,
          fechaRealizado: '',
          garantia: 0,
          fechaFinGarantia: '',
          status: 1
        };
        this.router.navigate(['/admin/servicios']);
      },
      (error) => {
        Swal.fire('Error', 'Error al guardar la información del servicio', 'error');
      }
    );
  }

  calcularFechaFinGarantia(fecha: string, garantia: number): string {
    const fechaRealizacion = new Date(fecha);
    fechaRealizacion.setMonth(fechaRealizacion.getMonth() + garantia);
    return fechaRealizacion.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  }
}
