import { Component } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  productos: any[] = [];

  constructor(private productoService: ProductoService) {}

  displayedProductos(): any[] {
    return this.productos.slice(0, 4);
  }

  ngOnInit(): void {
    this.productoService.listarProductos().subscribe(
      (dato: any) => {
        this.productos = dato;
      },
      (error) => {
        console.log(error)
        Swal.fire('Error!!', ' Error en el listado de productos', 'error');
      }
    )
  }

}