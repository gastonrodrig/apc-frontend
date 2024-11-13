import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-categoria',
  templateUrl: './view-categoria.component.html',
  styleUrls: ['./view-categoria.component.css']
})
export class ViewCategoriaComponent implements OnInit {
  categorias: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = '';

  constructor(
    private categoriaService: CategoriaService
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
    return this.categorias.filter((categoria: any) =>
      categoria.nombre.toLowerCase().includes(this.searchTerm1.toLowerCase())
    );
  }

  eliminarCategoria(categoriaId: any): void {
    Swal.fire({
      title: 'Eliminar categoria',
      text: '¿Estás seguro de eliminar la categoria de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(categoriaId).subscribe(
          (data) => {
            this.categorias = this.categorias.filter((categoria: any) => categoria.categoriaId !== categoriaId);
            Swal.fire('Categoría eliminada', 'La categoría ha sido eliminado de la base de datos', 'success');
            this.calculateTotalPages1();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar la categoría de la base de datos', 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    combineLatest([this.categoriaService.listarCategorias()]).subscribe(
      ([categorias]: [any]) => {
        this.categorias = categorias;
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
