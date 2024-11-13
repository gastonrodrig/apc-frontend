import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-producto',
  templateUrl: './view-producto.component.html',
  styleUrls: ['./view-producto.component.css']
})
export class ViewProductoComponent implements OnInit {
  productos: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = ''; // Nueva propiedad para el término de búsqueda

  constructor(
    private productoService: ProductoService
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
    return this.productos.filter((producto: any) =>
      producto.nombreProducto.toLowerCase().includes(this.searchTerm1.toLowerCase())
    );
  }

  eliminarProducto(productoId: any): void {
    Swal.fire({
      title: 'Eliminar producto',
      text: '¿Estás seguro de eliminar el producto de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(productoId).subscribe(
          (data) => {
            this.productos = this.productos.filter((producto: any) => producto.productoId !== productoId);
            Swal.fire('Producto eliminado', 'El producto ha sido eliminado de la base de datos', 'success');
            this.calculateTotalPages1();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el producto de la base de datos', 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    combineLatest([this.productoService.listarProductos()]).subscribe(
      ([productos]: [any]) => {
        this.productos = productos;
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
