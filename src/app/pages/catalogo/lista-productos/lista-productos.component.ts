import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CatalogoService } from 'src/app/services/catalogo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})

export class ListaProductosComponent implements OnInit {
  categorias: any[] = [];
  productosCatalogo: any[] = [];
  productosFiltrados: any[] = [];
  categoriasSeleccionadas: any[] = [];
  preciosSeleccionados: { min: number, max: number }[] = [];
  searchTerm: string = '';
  
  currentPage = 1;
  productsPerPage = 12;
  totalPages = 0;
  totalPagesArray: number[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private catalogoService: CatalogoService
  ){}

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.productosCatalogo.length / this.productsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  displayedProductos(): any[] {
    const starIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = starIndex + this.productsPerPage;
    const productos = this.productosFiltrados.slice(starIndex, endIndex);
    return productos;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  ngOnInit(): void {
    combineLatest([
      this.categoriaService.listarCategorias(),
      this.catalogoService.listarProductosCatalogo()
    ]).subscribe(
      ([categorias, productos]: [any, any]) => {
        this.categorias = categorias;
        this.productosCatalogo = productos;
        this.productosFiltrados = productos;
        this.calculateTotalPages();
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      (error)=> {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    )
  }

  filterAdvanceProduct() {
    const noHayProductosFiltrados = this.categoriasSeleccionadas.length === 0 && 
                                    this.preciosSeleccionados.length === 0 &&
                                    this.searchTerm.trim() === '';
  
    if (noHayProductosFiltrados) {
      this.productosFiltrados = this.productosCatalogo;
    } else {
      this.productosFiltrados = this.productosCatalogo.filter((productoCatalogo: any) => {
        const nombreValido = this.searchTerm.trim() === '' || 
          productoCatalogo.producto.nombreProducto.toLowerCase().includes(this.searchTerm.toLowerCase().trim());
          
        const productoValido = this.categoriasSeleccionadas.length === 0 ||
          this.categoriasSeleccionadas.some((categoria: any) => categoria.categoriaId === productoCatalogo.producto.categoria.categoriaId);

        const precioValido = this.preciosSeleccionados.length === 0 ||
          this.preciosSeleccionados.some(rango => productoCatalogo.producto.precio >= rango.min && productoCatalogo.producto.precio <= rango.max);
          
        return nombreValido && productoValido && precioValido;
        
      });
    }
  }

  filtrarProductosPorCategoria(event: any, categoria: any) {
    if (event.target.checked) {
      this.categoriasSeleccionadas.push(categoria);
    } else {
      const index = this.categoriasSeleccionadas.indexOf(categoria);
      if (index !== -1) {
        this.categoriasSeleccionadas.splice(index, 1);
      }
    }
    this.filterAdvanceProduct();
  }

  filtrarProductosPorPrecio(event: any, min: number, max: number) {
    if (event.target.checked) {
      this.preciosSeleccionados.push({ min, max });
    } else {
      this.preciosSeleccionados = this.preciosSeleccionados.filter(rango => rango.min !== min || rango.max !== max);
    }
    this.filterAdvanceProduct();
  }
  
  filtrarProductosBusqueda() {
    this.filterAdvanceProduct();
  }

}