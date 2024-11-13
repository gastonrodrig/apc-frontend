import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogoService } from 'src/app/services/catalogo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-catalogo-producto',
  templateUrl: './actualizar-catalogo-producto.component.html',
  styleUrls: ['./actualizar-catalogo-producto.component.css']
})
export class ActualizarCatalogoProductoComponent {

  constructor(
    private route: ActivatedRoute,
    private catalogoService: CatalogoService,
    private router: Router) { }

  catalogoId = 0;
  catalogoProducto: any;
  catalogoProductoOriginal: any;

  ngOnInit(): void {
    this.catalogoId = this.route.snapshot.params['catalogoId'];
    this.catalogoService.obtenerProductoCatalogo(this.catalogoId).subscribe(
      (data) => {
        this.catalogoProducto = data;
        this.catalogoProductoOriginal = { ...this.catalogoProducto }; // Hacemos una copia de los datos de la categoría para poder hacer una validación de cambio.
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volverACatalogo() {
    this.router.navigate(['/admin/catalogo']); 
  }
  actualizarDatos() {
    const precioOferta = this.catalogoProducto.precioOferta;
  
    if (precioOferta <= 0) {
      Swal.fire('Error en el sistema', 'El precio de oferta no puede ser menor o igual a cero', 'error');
      return
    }
  
    if (precioOferta >= this.catalogoProductoOriginal.producto.precio) {
      Swal.fire('Error en el sistema', 'El precio de oferta no puede ser mayor o igual que el precio original', 'error');
      return
    }
  
    this.catalogoProducto.precioOferta = precioOferta;
  
    this.catalogoService.actualizarProductoCatalogo(this.catalogoProducto).subscribe(
      (data) => {
        Swal.fire(
          'Producto de Catálogo actualizado',
          'El producto del catálogo ha sido actualizado con éxito',
          'success'
        ).then((e) => {
          this.router.navigate(['/admin/catalogo']);
        });
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'No se ha podido actualizar la información del producto del catálogo',
          'error'
        );
        console.log(error);
      }
    );
  }

}
