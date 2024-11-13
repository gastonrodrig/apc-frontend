import { Component, OnInit } from '@angular/core';
import { CatalogoService } from 'src/app/services/catalogo.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-catalogo',
  templateUrl: './view-catalogo.component.html',
  styleUrls: ['./view-catalogo.component.css']
})
export class ViewCatalogoComponent implements OnInit {
  catalogos: any = [];
  productosFiltrados: any[] = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = '';

  constructor(
    private catalogoService: CatalogoService
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
    return this.catalogos.filter((catalogo: any) =>
      catalogo.producto.nombreProducto.toLowerCase().includes(this.searchTerm1.toLowerCase().trim()));
  }

  eliminarProducto(catalogoId: any): void {
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
        this.catalogoService.eliminarProductoCatalogo(catalogoId).subscribe(
          (data) => {
            this.catalogos = this.catalogos.filter((catalogo: any) => catalogo.catalogoId !== catalogoId);
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
    combineLatest([this.catalogoService.listarProductosCatalogo()]).subscribe(
      ([catalogos]: [any]) => {
        this.catalogos = catalogos;
        this.calculateTotalPages1();
        console.log(this.catalogos);
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
