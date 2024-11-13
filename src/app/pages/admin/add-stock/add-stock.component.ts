import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventarioService } from 'src/app/services/inventario.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  productoId = 0;
  empleados: any = [];
  producto: any;
  cantidadAgregar: number = 0;

  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['productoId'];
    this.productoService.obtenerProducto(this.productoId).subscribe(
      (data) => {
        this.producto = data;
        console.log(this.producto);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  volverAProductos() {
    this.router.navigate(['/admin/productos']); 
  }

  public actualizarDatos() {
    if (this.validarProducto()) {
      const nuevaCantidad = this.producto.stock + this.cantidadAgregar;
      this.producto.stock = nuevaCantidad;
  
      this.productoService.actualizarProducto(this.producto).subscribe(
        (data) => {
          console.log('Producto actualizado:', this.producto);
      
          const movimiento = {
            cantidad: this.cantidadAgregar,
            tipo: 'Agregado',
            dateCreated: this.getCurrentDate(),
            producto: {
              productoId: this.producto.productoId,
            },
          };
      
          console.log('Movimiento:', movimiento);
  
          this.inventarioService.agregarProductoInventario(movimiento).subscribe(
            (dataMovimiento) => {
              Swal.fire('Cantidad actualizada y movimiento registrado en inventario', 'La cantidad ha sido actualizada y el movimiento ha sido registrado con éxito', 'success').then(
                (e) => {
                  this.router.navigate(['/admin/productos']);
                }
              );
            },
            (errorMovimiento) => {
              Swal.fire('Error en el sistema', 'No se ha podido registrar el movimiento', 'error');
              console.log(errorMovimiento);
            }
          );
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del producto', 'error');
          console.log(error);
        }
      );
    }
  }

  validarProducto() {
    if (this.cantidadAgregar <= 0) {
      Swal.fire('Error', 'La cantidad debe ser un número mayor que 0', 'error');
      return false;
    }
    return true;
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}