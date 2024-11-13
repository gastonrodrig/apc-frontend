import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddressesService } from 'src/app/services/addresses.service';
import { LoginService } from 'src/app/services/login.service';
import { OrdersService } from 'src/app/services/orders.service';
import { OrdersDetailsService } from 'src/app/services/ordersdetails.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from 'src/app/components/modal/add-address/add-address.component';
import { AddPaymentComponent } from 'src/app/components/modal/add-payment/add-payment.component';
import { InventarioService } from 'src/app/services/inventario.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css'],
})
export class EnvioComponent implements OnInit {

  myList: any[] = this.loadFromLocalStorage();
  user: any;

  // Datos Personales

  tipoDocumento = [
    {
      id: 1,
      name: 'DNI',
    },
    {
      id: 2,
      name: 'RUC',
    },
  ];

  metodoPago: any

  personalData = {
    tipoDocumento: null,
    numeroDocumento: '',
  };

  // Entrega

  provinciasFiltradas: any[] = [];
  distritosFiltrados: any[] = [];
  direccionesFiltradas: any[] = [];
  districtType: any

  // Pago

  hourMinutes: any

  // Guardar Orden en la BD

  producto = {
    productoId: '',
  };

  orderId: any;

  orderData = {
    createdAt: '',
    deliveryPrice: 0,
    status: '',
    streetAddress: '',
    subtotalPrice: 0,
    totalPrice: '',
    user: {
      id: '',
    },
    documento: '',
    fechaOperacion: '',
    noperacion: '',
    tipoOperacion: ''
  };

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

    // 1er Formulario

    firstFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
    });
  
    onSubmitForm_1() {
      if (!this.firstFormGroup.valid) {
        this.snack.open('Debe seleccionar una dirección', '', {
          duration: 3000,
        });
        return;
      }
    }

  // 2do Formulario

  secondFormGroup = this._formBuilder.group({
    tipoDocumento: [null, Validators.required],
    nroDocumento: [
      { value: '', disabled: true },
      [Validators.required, this.documentValidator()],
    ],
  });

  isDocumentoEnabled = false;

  onTipoDocumentoChange() {
    const tipoDocumentoControl = this.secondFormGroup.get('tipoDocumento');
    const nroDocumentoControl = this.secondFormGroup.get('nroDocumento');

    if (tipoDocumentoControl && nroDocumentoControl) {
      // Verificación de nulidad
      const tipoDocumento = tipoDocumentoControl.value;

      if (tipoDocumento === 1 || tipoDocumento === 2) {
        nroDocumentoControl.enable();
      } else {
        nroDocumentoControl.disable();
        nroDocumentoControl.reset();
      }
    }
  }

  documentValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const tipoDocumento = this.secondFormGroup?.get('tipoDocumento')?.value;

      if (!tipoDocumento) {
        return null;
      }

      if (tipoDocumento === 1 && value.length !== 8) {
        return { invalidDNI: true };
      }

      if (tipoDocumento === 2) {
        if (value.length !== 11) {
          return { invalidRUC: true };
        }
        const stockRegex = /^10\d{9}$/;
        if (!stockRegex.test(value)) {
          return { invalidRUCFormat: true };
        }
      }

      return null;
    };
  }

  validFirstStep: boolean = false;

  onSubmitForm_2() {

    if (!this.secondFormGroup.valid) {
      this.snack.open('Debe Seleccionar el Tipo de Documento', '', {
        duration: 3000,
      });

      const errors = this.secondFormGroup.get('nroDocumento')?.errors;
      if (errors) {
        if (errors['invalidDNI']) {
          this.snack.open('El número del documento (DNI) debe tener 8 dígitos', '', {
            duration: 3000,
          });
          return;
        } else if (errors['invalidRUC']) {
          this.snack.open('El número del documento (RUC) debe tener 11 dígitos', '', {
            duration: 3000,
          });
          return;
        } else if (errors['invalidRUCFormat']) {
          this.snack.open('El número del documento (RUC) debe iniciar con 10', '', {
            duration: 3000,
          });
          return;
        }
      }

      return;
    }
  }

  // 3er Formulario

  dataPago: any

  constructor(
    private snack: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private addressesService: AddressesService,
    private loginService: LoginService,
    private orderService: OrdersService,
    private orderDetailsService: OrdersDetailsService,
    private productoService: ProductoService,
    private http: HttpClient,
    private inventarioService: InventarioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    this.orderData.user.id = this.user.id;

    this.orderData.createdAt = this.getCurrentDate();
    this.orderData.status = 'Solicitado';
    this.orderData.subtotalPrice = this.subtotal();
    this.orderData.totalPrice = this.totalCart();

    if (this.orderData.user.id) {
      this.addressesService.listarAddressesByUser(this.user.id).subscribe(
        (data: any) => {
          this.direccionesFiltradas = data;
        },
        (error) => {
          console.log(error);
          Swal.fire('Error !!', 'Error al cargar los datos', 'error');
        }
      );
    }
  }

  guardarInformacion() {
    console.log(this.dataPago)
    if(this.dataPago === undefined) {
      this.snack.open('El pago no ha sido registrado', '', {
        duration: 3000,
      });
      return;
    } 

    this.hourMinutes = this.dataPago.hourMinutes
    this.orderData.fechaOperacion = this.formatDate() + 'T' + this.getCurrentTimeFormatted()
    this.orderData.noperacion = this.dataPago.nOperacion
    this.orderData.totalPrice = this.totalCart()

    this.orderService.agregarOrder(this.orderData).subscribe(
      (data: any) => {
        console.log(data)
        Swal.fire('Orden guardada', 'Se ha agregado su orden', 'success');
        const orderIdData = data.orderId;

        this.myList.forEach((element) => {
          this.orderDetailsData.createdAt = this.getCurrentDate();
          this.orderDetailsData.quantity = element.cantidad;
          this.orderDetailsData.unitPrice = element.precio;
          this.orderDetailsData.totalPrice = element.cantidad * element.precio;
          this.orderDetailsData.order = { orderId: orderIdData };
          this.orderDetailsData.product.productoId = element.productoId;
          this.producto.productoId = this.orderDetailsData.product.productoId;

          this.orderDetailsService
            .agregarOrdersDetail(this.orderDetailsData)
            .subscribe(
              (data: any) => {
                const storedList = localStorage.getItem('myList');
                // Verificar que el objeto exista y no sea null
                if (storedList) {
                  // Parsear el objeto
                  let myList = JSON.parse(storedList);
                  // Vaciar el objeto
                  myList = [];
                  // Guardar el objeto vacío de nuevo en el local storage
                  localStorage.setItem('myList', JSON.stringify(myList));
                } else {
                  console.log(
                    'No se encontró ningún objeto con la clave "myList" en el local storage.'
                  );
                }
              },
              (error) => {
                console.log(error);
                Swal.fire('Error !!', 'Error al cargar los datos', 'error');
              }
            );

            const movimiento = {
              cantidad: this.orderDetailsData.quantity,
              tipo: 'Reservado',
              dateCreated: this.getCurrentDate(),
              producto: {
                productoId: this.orderDetailsData.product.productoId
              },
            };
        
            console.log('Movimiento:', movimiento);
    
            this.inventarioService.agregarProductoInventario(movimiento).subscribe(
              (dataMovimiento) => {
                
              },
              (errorMovimiento) => {
                Swal.fire('Error en el sistema', 'No se ha podido registrar el movimiento', 'error');
                console.log(errorMovimiento);
              }
            );

          element.stock = element.stock - this.orderDetailsData.quantity;

          this.productoService.actualizarProducto(element).subscribe(
            (data: any) => {

            },
            (error) => {
              Swal.fire('Error !!', 'Error al cargar los datos', 'error');
            }
          );
        });
        Swal.fire('Orden guardada', 'Se ha agregado su orden', 'success').
          then((e) => {
            this.router.navigate(['/user/historial-de-pedidos']);
          });
      },
      (error) => {
        console.log(error);
        Swal.fire('Error !!', 'Error al cargar los datos', 'error');
      }
    );
  }

  formatDate() {
    const fechaString = this.dataPago.fechaOperacion.toString();
  
    // Crear objeto de fecha
    const fecha = new Date(fechaString);
    // Obtener año, mes y día
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // Sumar 1 al mes ya que en JavaScript los meses van de 0 a 11
    const day = ('0' + fecha.getDate()).slice(-2);
  
    // Formatear en YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  getCurrentTimeFormatted() {
    if (this.hourMinutes) {
      const [hours, minutes] = this.hourMinutes.split(':');
      if(Number(hours) < 4) {
        const horaReal = Number(hours) + 5
        const horaString = "0"+horaReal
        return `${horaString}:${minutes}:00.000000`;
      } else {
        const horaReal = Number(hours) + 5;
        return `${horaReal.toString()}:${minutes}:00.000000`;
      }
    } else {
      return 'this.hourMinutes no está definido o es undefined';
    }
  }

  roundToDecimals(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  onMatFieldChange(): void {
    this.validFirstStep = false;
  }

  openAddressDialog() {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: '50%',
      height: '82%'
    });

    dialogRef.afterClosed().subscribe( data => {
      this.addressesService.listarAddressesByUser(this.user.id).subscribe(
        (data: any) => {
          this.direccionesFiltradas = data;
        },
        (error) => {
          Swal.fire('Error !!', 'Error al cargar los datos', 'error');
        }
      )
      }
    )
  }

  openPaymentDialog(metodoPago: any) {
    this.metodoPago = metodoPago
    if(this.metodoPago === 1) {
      this.dataPago = undefined
      if(this.totalCart() > 500) {
        this.snack.open('El pago supera los S/.500 (Cantidad Máxima en Yape)', '', {
          duration: 3000,
        });
        return;
      }
      this.orderData.tipoOperacion = 'Yape'
      const dialogRef = this.dialog.open(AddPaymentComponent, {
        data: {
          metodoPago: 1,
          total: this.totalCart()
        },
        width: '50%',
        height: '82%'
      });

      dialogRef.afterClosed().subscribe(res => {
        this.dataPago = res.data
      })

    } 
    if(this.metodoPago === 2) {
      this.dataPago = undefined
      this.orderData.tipoOperacion = 'BCP'
      const dialogRef = this.dialog.open(AddPaymentComponent, {
        data: {
          metodoPago: 2,
          total: this.totalCart()
        },
        width: '45%',
        height: '82%'
      });

      dialogRef.afterClosed().subscribe(res => {
        this.dataPago = res.data
      })
    }
    if(this.metodoPago === 3) {
      this.dataPago = undefined
      if(this.totalCart() > 500) {
        this.snack.open('El pago supera los S/.500 (Cantidad Máxima en Plin)', '', {
          duration: 3000,
        });
        return;
      }
      this.orderData.tipoOperacion = 'Plin'
      const dialogRef = this.dialog.open(AddPaymentComponent, {
        data: {
          metodoPago: 3,
          total: this.totalCart()
        },
        width: '50%',
        height: '82%'
      });

      dialogRef.afterClosed().subscribe(res => {
        this.dataPago = res.data
      })
    }
    if(this.metodoPago === 4) {
      this.dataPago = undefined
      this.orderData.tipoOperacion = 'CCI'
      const dialogRef = this.dialog.open(AddPaymentComponent, {
        data: {
          metodoPago: 4,
          total: this.totalCart()
        },
        width: '45%',
        height: '82%'
      });

      dialogRef.afterClosed().subscribe(res => {
        this.dataPago = res.data
      })
    }
  }

  loadFromLocalStorage() {
    const storedList = localStorage.getItem('myList');
    return storedList ? JSON.parse(storedList) : [];
  }

  cantidadProductos(): any {
    return this.myList.reduce(function (acc, product) {
      return acc + product.cantidad;
    }, 0);
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
    const total = this.myList.reduce(function (acc, product) { return acc + (product.cantidad * product.precio); }, 0) + this.orderData.deliveryPrice
    return total
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }

  onAddressChange(direccion: any) {
    this.orderData.streetAddress = `${direccion.name}, ${direccion.district.name}, ${direccion.province.name}, ${direccion.department.name}`;
    this.districtType = direccion.district.type
    if(this.districtType === 'A') {
      this.orderData.deliveryPrice = 0;
    }
    if(this.districtType === 'B') {
      this.orderData.deliveryPrice = 10;
    }
    if(this.districtType === 'C') {
      this.orderData.deliveryPrice = 15
    }
    if(this.districtType === 'D') {
      this.orderData.deliveryPrice = 30
    }
  }

}
