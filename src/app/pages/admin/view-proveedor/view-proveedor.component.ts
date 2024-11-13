import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-proveedor',
  templateUrl: './view-proveedor.component.html',
  styleUrls: ['./view-proveedor.component.css']
})
export class ViewProveedorComponent implements OnInit {
  proveedores: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = '';

  constructor(
    private proveedorService: ProveedorService
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

  calculateTotalPages1(): void {
    this.totalPages1 = Math.ceil(this.filteredProductos().length / this.rowsPerPage1);
    if (this.currentPage1 > this.totalPages1) {
      this.currentPage1 = 1;
    }
  }

  displayedProductos(): any[] {
    const startIndex = (this.currentPage1 - 1) * this.rowsPerPage1;
    const endIndex = startIndex + this.rowsPerPage1;
    return this.filteredProductos().slice(startIndex, endIndex);
  }

  filteredProductos(): any[] {
    return this.proveedores.filter((proveedor: any) =>
      proveedor.razonSocial.toLowerCase().includes(this.searchTerm1.toLowerCase())
    );
  }

  eliminarProveedor(proveedorId: any): void {
    Swal.fire({
      title: 'Eliminar Proveedor',
      text: '¿Estás seguro de eliminar al proveedor de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminarProveedor(proveedorId).subscribe(
          (data) => {
            this.proveedores = this.proveedores.filter((proveedor: any) => proveedor.proveedorId !== proveedorId);
            Swal.fire('Proveedor eliminado', 'El proveedor ha sido eliminado de la base de datos', 'success');
            this.calculateTotalPages1();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el proveedor de la base de datos', 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    combineLatest([this.proveedorService.listarProveedores()]).subscribe(
      ([proveedores]: [any]) => {
        this.proveedores = proveedores;
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
