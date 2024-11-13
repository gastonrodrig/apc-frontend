import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent {
  user: any = null;
  solicitudes: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;

  constructor(
    private solicitudService: SolicitudService,
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
    this.totalPages1 = Math.ceil(this.displayedRequests().length / this.rowsPerPage1);
    if (this.currentPage1 > this.totalPages1) {
      this.currentPage1 = 1;
    }
  }

  displayedRequests(): any[] {
    const startIndex = (this.currentPage1 - 1) * this.rowsPerPage1;
    const endIndex = startIndex + this.rowsPerPage1;
    return this.solicitudes.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    combineLatest([this.solicitudService.listarSolicitudesByUser(this.user.id)]).subscribe(
      ([solicitudes] : [any]) => {
        this.solicitudes = solicitudes
        console.log(this.solicitudes)
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }

}
