import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-estado-pedido',
  templateUrl: './actualizar-estado-pedido.component.html',
  styleUrls: ['./actualizar-estado-pedido.component.css']
})
export class ActualizarEstadoPedidoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router
  ) { }

  orderId = 0;
  estados: any = ['En preparación', 'Enviado', 'Entregado'];
  estadoSeleccionado: string = '';
  order: any;
  cantidadAgregar: number = 0;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
    this.ordersService.obtenerOrder(this.orderId).subscribe(
      (data) => {
        this.order = data;
        console.log(this.order);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  volverAProductos() {
    this.router.navigate(['/admin/pedidos']);
  }

  public actualizarDatos() {
    const estadoActual = this.order.status;

    if (estadoActual === this.estadoSeleccionado) {
      Swal.fire('Estado no actualizado', 'El estado seleccionado es igual al estado actual', 'warning');
      return;
    }

    const idUser = this.order.user.id;
    const estadosPermitidos = this.getEstadosPermitidos(estadoActual);

    if (!estadosPermitidos.includes(this.estadoSeleccionado)) {
      Swal.fire('Estado no permitido', 'No se permite cambiar a este estado desde el estado actual', 'error');
      return;
    }

    this.order.status = this.estadoSeleccionado;
    this.order.user = {
      accountNonExpired: false,
      accountNonLocked: false,
      apellido: null,
      authorities: null,
      credentialsNonExpired: false,
      email: null,
      enabled: false,
      id: idUser,
      nombre: null,
      password: null,
      perfil: null,
      telefono: null,
      username: null
    };

    this.ordersService.actualizarOrder(this.order).subscribe(
      (data) => {
        this.order = data;
        Swal.fire('Estado actualizado', 'El estado del pedido ha sido actualizado correctamente', 'success');
        this.volverAProductos(); // Redirección después de actualizar
      },
      (error) => {
        Swal.fire('Error en el sistema', 'No se ha podido actualizar la información del producto', 'error');
        console.log(error);
      }
    );
  }

  private getEstadosPermitidos(estadoActual: string): string[] {
    switch (estadoActual) {
      case 'En preparación':
        return ['Enviado'];
      case 'Enviado':
        return ['Entregado'];
      case 'Pagado':
        return ['En preparación'];
      default:
        return [];
    }
  }
}
