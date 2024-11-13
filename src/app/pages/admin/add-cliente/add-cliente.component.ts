import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {

  clienteData = {
    ruc: '',
    razonSocial: '',
    dateCreated: '',
    status: 0
  };

  constructor(
    private snack: MatSnackBar,
    private clienteService: ClienteService,
    private router: Router) { }
  ngOnInit(): void {

  }
  volver() {
    this.router.navigate(['/admin/clientes']); 
  }
  guardarInformacion() {
    console.log(this.clienteData);
    if (this.clienteData.ruc.trim() === '' || this.clienteData.ruc == null) {
      this.snack.open('El RUC es requerido', '', {
        duration: 3000
      });
      return;
    }
  
    if (this.clienteData.razonSocial.trim() === '' || this.clienteData.razonSocial == null) {
      this.snack.open('La Razón Social es requerida', '', {
        duration: 3000
      });
      return;
    }

    // Obtener la fecha actual
    this.clienteData.dateCreated = this.getCurrentDate();
    this.clienteData.status = 1; // Establecer el estado como 'Activo'

    // Continuar con el resto del código para guardar la categoría
    this.clienteService.listarClientes().subscribe(
      (clientes: any) => {
        const existeRazonSocial = clientes.some((cliente: any) => cliente.razonSocial.trim().toLowerCase() === this.clienteData.razonSocial.trim().toLowerCase());
        const existeRUC = clientes.some((cliente: any) => cliente.ruc.trim().toLowerCase() === this.clienteData.ruc.trim().toLowerCase());
        if (existeRazonSocial || existeRUC) {
          this.snack.open('Ya existe un cliente con esos datos', '', {
            duration: 3000
          });
        } else {
          this.clienteService.agregarCliente(this.clienteData).subscribe(
            (data) => {
              console.log(data);
              Swal.fire({
                title: 'Cliente guardado',
                text: 'El cliente ha sido guardado con exito',
                icon: 'success',
                confirmButtonColor: '#00CED1',
                confirmButtonText: 'Ok',
              });
              this.clienteData = { // Reiniciar los datos después de guardar
                ruc: '',
                razonSocial: '',
                dateCreated: '',
                status: 0
              };
              this.router.navigate(['/admin/clientes']);
            },
            (error) => {
              Swal.fire('Error', 'Error al guardar la información del cliente', 'error');
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener la lista de clientes:', error);
        this.snack.open('Error al obtener la lista de clientes', '', {
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