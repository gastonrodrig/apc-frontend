import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  myList: any[] = this.loadFromLocalStorage()
  productoId = 0;
  producto: any;
  viewCart: boolean = false;
  user = {
    id: ''
  }

  constructor(private loginService: LoginService){} 

  ngOnInit(): void {
    this.user = this.loginService.getUser();

    this.myList.find((element) => {
      this.producto = element
    });
  }

  updateUnits(operation: string, id: string) {
    const producto = this.myList.find((element) => {
      return element.productoId === id;
    });
    
    if(producto) {
      if(operation === 'minus' && producto.cantidad > 0) {
        producto.cantidad = producto.cantidad - 1;
        this.saveToLocalStorage();
      }
      if(operation === 'add') {
        producto.cantidad = producto.cantidad + 1;
        this.saveToLocalStorage();
      }
      if(producto.cantidad === 0) {
        this.deleteProduct(id);
        this.saveToLocalStorage();
      }
    }
  }

  deleteProduct(id: string) {
    this.myList = this.myList.filter((product) => {
      return product.productoId != id
    })
    this.saveToLocalStorage();
  }

  subtotal() {
    const subtotal = this.totalCart() * (1-0.18)
    return Number(subtotal.toFixed(2));
  }

  igv() {
    const igv = this.totalCart() * (0.18)
    return Number(igv.toFixed(2));
  }

  totalCart() {
    const total = this.myList.reduce(function (acc, product) { return acc + (product.cantidad * product.precio); }, 0)
    return total
  }

  saveToLocalStorage() {
    localStorage.setItem('myList', JSON.stringify(this.myList));
  }

  loadFromLocalStorage() {
    const storedList = localStorage.getItem('myList');
    return storedList ? JSON.parse(storedList) : [];
  }

  cantidadProductos() {
    return this.myList.reduce(function (acc, product) { return acc + product.cantidad; }, 0)
  }

}
