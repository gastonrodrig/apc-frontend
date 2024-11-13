import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { InventarioService } from 'src/app/services/inventario.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoCatalogoComponent {

  myList: any[] = this.loadFromLocalStorage() || [];
  productoId = 0;
  producto: any;
  productoStock: any;
  quantity: number = 1;
  i=1;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router) {  }

  plus() {
    if(this.i != this.productoStock) {
      this.i++;
      this.quantity = this.i;
    }
  }

  minus() {
    if(this.i != 1) {
      this.i--;
      this.quantity = this.i;
    }
  }

  restarStock() {
    var nuevaCantidad = -1;
    if(this.quantity <= this.producto.cantidad){
      nuevaCantidad = this.producto.cantidad - this.quantity;
      this.producto.cantidad = nuevaCantidad;
    }
    
    if(nuevaCantidad < 0) {
      Swal.fire('Error en el sistema', 'No hay suficiente stock del producto', 'error');
    }
    else {
      this.productoService.actualizarProducto(this.producto).subscribe(
        (data) => {
          Swal.fire('Producto agregado al carrito', 'El producto se ha agregado correctamente a tu carrito de compras', 'success');
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del producto', 'error');
          console.log(error);
        }
      )
    }
  }

  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['productoId'];
    this.productoService.obtenerProducto(this.productoId).subscribe((producto: any) => 
      {
        this.producto = producto;
        this.productoStock = producto.stock
      },
      (error)=> {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    )
  }

  addProduct(producto: any) {
    if (this.myList.length === 0) {
      producto.cantidad = this.quantity;
      this.myList.push(producto);
    } else {
      const productMod = this.myList.find((element) => {
        return element.productoId === producto.productoId;
      });
    
      if (productMod) {
        const nuevaCantidad = productMod.cantidad + this.quantity;
        if(nuevaCantidad > producto.stock) {
          if(producto.stock === 1) {
            Swal.fire('Error en el sistema', 'Solo puede llevar 1 unidad', 'error');
          }
          if(producto.stock > 1) {
            Swal.fire('Error en el sistema', `Solo puede llevar ${producto.stock} unidades`, 'error');
          }
          producto.cantidad = productMod.cantidad + 0;
        } else {
          Swal.fire('Producto agregado al carrito', 'El producto se ha agregado correctamente a tu carrito de compras', 'success');
          productMod.cantidad = nuevaCantidad
        }
      } else {
        Swal.fire('Producto agregado al carrito', 'El producto se ha agregado correctamente a tu carrito de compras', 'success');
        producto.cantidad = this.quantity;
        this.myList.push(producto);
      }
    }
    this.saveToLocalStorage();
  }

  addToCart(product: any) {
    this.addProduct(product)
  }

  saveToLocalStorage() {
    localStorage.setItem('myList', JSON.stringify(this.myList));
  }

  loadFromLocalStorage() {
    const storedList = localStorage.getItem('myList');
    return storedList ? JSON.parse(storedList) : [];
  }


}
