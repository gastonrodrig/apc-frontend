import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAddressComponent } from 'src/app/components/modal/add-address/add-address.component';
import { AddressesService } from 'src/app/services/addresses.service';
import { LoginService } from 'src/app/services/login.service';
import { ProductoService } from 'src/app/services/producto.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  productoId = 0;
  producto: any;

  solicitudData = {
    createdAt: '',
    quantity: '',
    streetAddress: '',
    subtotalPrice: 0,
    status: '',
    unitPrice: 0,
    product: {
      productoId: ''
    },
    user: {
      id: ''
    },
    fechaPlazo: '',
    documento: ''
  }

  tipoDocumento: string | null = null;
  documentoControl = new FormControl({ value: '', disabled: true }, [Validators.required]);

  onTipoDocumentoChange() {
    if (this.tipoDocumento) {
      this.documentoControl.enable();
    } else {
      this.documentoControl.disable();
    }
  }

  user = {
    id: ''
  }

  orderDetailsData = {
    createdAt: '',
    quantity: 0,
    totalPrice: 0,
    unitPrice: 0,
    updatedAt: '',
    order: {
      orderId: '',
    },
    product: {
      productoId: '',
    },
  };

  direcciones: any[] = [];
  onChangeQuantity: boolean = false
  cantidad: number = 0
  precioProducto: number = 0
  direccion: string = ''
  minDate = new Date()

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private productoService: ProductoService,
    private loginService: LoginService,
    private addressesService: AddressesService,
    private solicitudService: SolicitudService,
    private router: Router
  ){}

  ngOnInit() : void {
    this.productoId = this.route.snapshot.params['productoId'];
    this.productoService.obtenerProducto(this.productoId).subscribe((data: any) => 
      {
        this.precioProducto = data.precio
        this.filtrarPrecio(data)
        this.formatDate(data)
        this.producto = data
      },
      (error)=> {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    )
    this.user = this.loginService.getUser()
    if (this.user) {
      this.addressesService.listarAddressesByUser(this.user.id).subscribe(
        (data: any) => {
          this.direcciones = data;
        },
        (error) => {
          Swal.fire('Error !!', 'Error al cargar los datos', 'error');
        }
      )
    }
  }

  enviarSolicitud() {
    if (!this.tipoDocumento) {
      this.snack.open('Debe seleccionar el Tipo de Documento', '', {
        duration: 3000
      });
      return;
    }

    if (this.tipoDocumento === 'dni') {
      if(this.solicitudData.documento.length !== 8) {
        this.snack.open('El número del documento (DNI) debe tener 8 dígitos', '', {
          duration: 3000
        });
        return;
      } 
    }

    if (this.tipoDocumento === 'ruc') {
      if(this.solicitudData.documento.length !== 11) {
        this.snack.open('El número del documento (RUC) debe tener 11 dígitos', '', {
          duration: 3000
        });
        return;
      }

      const stockRegex = /^10\d{9}$/;
      if(!stockRegex.test(this.solicitudData.documento)) {
        this.snack.open('El número del documento (RUC) debe iniciar con 10', '', {
          duration: 3000
        });
        return;
      }
    }

    if (this.solicitudData.quantity === '' || this.solicitudData.quantity == null) {
      this.snack.open('La cantidad de la solicitud es requerida', '', {
        duration: 3000
      });
      return;
    }

    if(parseFloat(this.solicitudData.quantity) <= 0) {
      this.snack.open('La cantidad de la solicitud no puede ser menor o igual a 0', '', {
        duration: 3000
      });
      return;
    }

    if(this.solicitudData.fechaPlazo === '' || this.solicitudData.fechaPlazo == null) {
      this.snack.open('La fecha de plazo es requerida', '', {
        duration: 3000
      });
      return;
    }
  
    if (this.solicitudData.streetAddress === '' || this.direcciones.length === 0) {
      this.snack.open('La direccion de la solicitud es requerida', '', {
        duration: 3000
      });
      return;
    }

    this.solicitudData.user.id = this.user.id
    this.solicitudData.createdAt = this.getCurrentDate()
    this.solicitudData.unitPrice = this.precioProducto
    this.solicitudData.subtotalPrice = this.total()
    this.solicitudData.status = 'Solicitado'
    this.solicitudData.streetAddress = this.direccion
    this.solicitudData.product.productoId = this.producto.productoId

    this.solicitudService.agregarSolicitud(this.solicitudData).subscribe(
      (data: any) => {
        Swal.fire('Solicitud Enviada', 'Su solicitud ha sido enviada', 'success')
        .then((e) => {
          this.router.navigate(['/catalogo']);
        });
      },
      (error) => {
        Swal.fire('Error !!', 'Error al enviar su solicitud', 'error');
      }
    )
  }

  filtrarPrecio(data: any) {
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

  openAddressCustom() {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      height: '82%'
    });

    dialogRef.afterClosed().subscribe( 
      (data) => {
        this.addressesService.listarAddressesByUser(this.user.id).subscribe(
          (data: any) => {
            this.direcciones = data;
            console.log(this.direcciones)
          },
          (error) => {
            Swal.fire('Error !!', 'Error al cargar los datos', 'error');
          }
        )
      }
    )
  }

  direccionSeleccionada(direccion: any) {
    this.direccion = `${direccion.name}, ${direccion.district.name}, ${direccion.province.name}, ${direccion.department.name}`;
    console.log(this.direccion)
  }

  cantidadCambiada(cantidad: any) {
    this.onChangeQuantity = true
    this.cantidad = cantidad
  }

  subtotal() {
    const subtotal = this.total() * (1-0.18)
    return Number(subtotal.toFixed(2));
  }

  igv() {
    const igv = this.total() * (0.18)
    return Number(igv.toFixed(2));
  }

  total() {
    const total = this.cantidad * this.precioProducto
    return total
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}
