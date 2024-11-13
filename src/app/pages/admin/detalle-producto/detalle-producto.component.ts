import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent {
  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router) { }

  productoId = 0;
  producto: any;
  
  ngOnInit(): void {
    this.productoId = this.route.snapshot.params['productoId'];
    this.productoService.obtenerProducto(this.productoId).subscribe(
      (data) => {
        this.filtrarPrecio(data);
        this.formatDate(data);
        this.producto = data;
        console.log(this.producto)
      },
      (error)=> {
        console.log(error);
      }
    )
  }

  filtrarPrecio(data: any){
    return data.precio = "S/. " + data.precio;
  }
formatDate(data: any) {
    const date = new Date(data.dateCreated);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return data.dateCreated = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

}
