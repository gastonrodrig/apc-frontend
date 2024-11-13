import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-cliente',
  templateUrl: './view-cliente.component.html',
  styleUrls: ['./view-cliente.component.css']
})
export class ViewClienteComponent implements OnInit {
  clientes: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = '';

  constructor(
    private clienteService: ClienteService
  ) {}

  prevPage1(): void {
    if (this.currentPage1 > 1) {
      this.currentPage1--;
    }
  }

  nextPage1(): void {
    if (this.currentPage1 < this.totalPages1) {
      this.currentPage1++;
    }
  }

  calculateTotalPages(): void {
    this.totalPages1 = Math.ceil(this.filter().length / this.rowsPerPage1);
    if (this.currentPage1 > this.totalPages1) {
      this.currentPage1 = 1;
    }
  }

  display(): any[] {
    const startIndex = (this.currentPage1 - 1) * this.rowsPerPage1;
    const endIndex = startIndex + this.rowsPerPage1;
    return this.filter().slice(startIndex, endIndex);
  }

  filter(): any[] {
    return this.clientes.filter((cliente: any) =>
      cliente.razonSocial.toLowerCase().includes(this.searchTerm1.toLowerCase())
    );
  }

  eliminarCliente(clienteId: any): void {
    Swal.fire({
      title: 'Eliminar cliente',
      text: '¿Estás seguro de eliminar al cliente de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.eliminarCliente(clienteId).subscribe(
          (data) => {
            this.clientes = this.clientes.filter((cliente: any) => cliente.clienteId !== clienteId);
            Swal.fire('Cliente eliminado', 'El cliente ha sido eliminado de la base de datos', 'success');
            this.calculateTotalPages();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el cliente de la base de datos', 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    combineLatest([this.clienteService.listarClientes()]).subscribe(
      ([clientes]: [any]) => {
        this.clientes = clientes;
        this.calculateTotalPages();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
