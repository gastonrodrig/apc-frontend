import { Component, OnInit } from '@angular/core';
import { AddressesService } from 'src/app/services/addresses.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-user-addresses',
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.css']
})
export class UserAddressesComponent implements OnInit {
  user: any = null;
  addresses: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;

  constructor(
    private addressesService: AddressesService,
    private loginService: LoginService,
  ) {}

  prevPage1(): void {
    if (this.currentPage1 > 1) {
      this.currentPage1--;
    }
  }

  nextPage1(): void {
    if (this.currentPage1 < this.totalPages1) {
      this.currentPage1++;
    }
  }

  calculateTotalPages1(): void {
    this.totalPages1 = Math.ceil(this.displayedOrders().length / this.rowsPerPage1);
    if (this.currentPage1 > this.totalPages1) {
      this.currentPage1 = 1;
    }
  }

  displayedOrders(): any[] {
    const startIndex = (this.currentPage1 - 1) * this.rowsPerPage1;
    const endIndex = startIndex + this.rowsPerPage1;
    return this.addresses.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    combineLatest([this.addressesService.listarAddressesByUser(this.user.id)]).subscribe(
      ([addresses]: [any]) => {
        this.addresses = addresses
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }

  eliminarProducto(addressId: any): void {
    Swal.fire({
      title: 'Eliminar producto',
      text: '¿Estás seguro de eliminar el producto de la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressesService.eliminarAddress(addressId).subscribe(
          (data) => {
            this.addresses = this.addresses.filter((address: any) => address.addressId !== addressId);
            Swal.fire('Direccion Eliminada', 'La direccion ha sido eliminado de la base de datos', 'success');
            this.calculateTotalPages1();
          },
          (error) => {
            Swal.fire('Error', 'Error al eliminar el producto de la base de datos', 'error');
          }
        );
      }
    });
  }
}
