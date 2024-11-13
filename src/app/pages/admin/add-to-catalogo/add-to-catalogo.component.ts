import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-to-catalogo',
  templateUrl: './add-to-catalogo.component.html',
  styleUrls: ['./add-to-catalogo.component.css'],
})
export class AddToCatalogoComponent {

  productoCatalogoData = {
    catalogo: {
      catalogoId: '',
    },
    producto: {
      productoId: '',
      nombreProducto: '',
      precio: '',
      sku: '',
    },
    precioOferta: 0,
  };

  productosList: any[] = [];
  catalogoList: any[] = [];
  skuChanged: boolean = false;

  constructor(
    private productoService: ProductoService,
    private catalogoService: CatalogoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProducto(this.productoCatalogoData)
    this.productoService.listarProductos().subscribe(
      (data: any) => {
        this.productosList = data
      },
      (error) => {
        Swal.fire('Error !!', 'Error al cargar los datos', 'error')
      }
    );
    this.catalogoService.listarProductosCatalogo().subscribe(
      (data: any) => {
        this.catalogoList = data
      },
      (error) => {
        Swal.fire('Error !!', 'Error al cargar los datos', 'error')
      }
    );
  }

  volverAProductos() {
    this.router.navigate(['/admin/catalogo'])
  }

  onChangeSku() {
    this.skuChanged = false
  }

  buscarProductoPorSku() {
    const skuBuscado = this.productoCatalogoData.producto.sku
    const productoEncontrado = this.productosList.find((producto) => producto.sku === skuBuscado);
    const productoCatalogoEncontrado = this.catalogoList.find((element) => element.producto.sku === skuBuscado);

    if (!productoEncontrado) {
      Swal.fire('Producto no encontrado', 'El sku que has ingresado no está registrado en productos', 'error')
      this.productoCatalogoData.producto.nombreProducto = ''
      return
    }

    if(productoCatalogoEncontrado) {
      Swal.fire('Error en el sistema', 'Este producto ya existe en el catálogo', 'error');
      this.productoCatalogoData.producto.nombreProducto = '' 
      return
    }

    this.skuChanged = true
    this.productoCatalogoData.producto = { ...productoEncontrado }
  }

  guardarInformacion() {
    const precioOferta = Number(this.productoCatalogoData.precioOferta)

    if(this.skuChanged === false) {
      Swal.fire('Error en el sistema', 'Debe buscar un sku válido', 'error')
      return
    }

    // Verificación del precio de oferta
    //if (precioOferta <= 0) {
      //Swal.fire('Error en el sistema', 'El precio de oferta no puede ser menor o igual a cero', 'error')
      //return
    //}

    //if (precioOferta >= Number(this.productoCatalogoData.producto.precio)) {
      //Swal.fire('Error en el sistema', 'El precio de oferta no puede ser mayor o igual que el precio original', 'error')
      //return
    //}

    this.productoCatalogoData.precioOferta = precioOferta
    this.catalogoService.agregarProductoCatalogo(this.productoCatalogoData)
      .subscribe(
        (data) => {
          Swal.fire('Producto agregado al Catálogo', 'El producto ha sido agregado al catálogo con éxito', 'success')
          .then((e) => {
            this.router.navigate(['/admin/catalogo']);
          });
        },
        (error) => {
          Swal.fire('Error en el sistema', 'No se ha podido agregar el producto al catálogo', 'error');
        }
      );
  }
}
