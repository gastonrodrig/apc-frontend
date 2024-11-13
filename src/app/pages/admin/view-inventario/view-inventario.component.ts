import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/services/inventario.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-inventario',
  templateUrl: './view-inventario.component.html',
  styleUrls: ['./view-inventario.component.css']
})
export class ViewInventarioComponent implements OnInit {
  inventarios: any = [];
  productosFiltrados: any[] = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = '';

  constructor(
    private inventarioService: InventarioService
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
    return this.inventarios.filter((inventario: any) =>
      inventario.producto.nombreProducto.toLowerCase().includes(this.searchTerm1.toLowerCase().trim()));
  }

  ngOnInit(): void {
    combineLatest([this.inventarioService.listarInventario()]).subscribe(
      ([inventarios]: [any]) => {
        this.inventarios = inventarios.sort((a: any, b: any) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        this.calculateTotalPages1();
        console.log(this.inventarios);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
