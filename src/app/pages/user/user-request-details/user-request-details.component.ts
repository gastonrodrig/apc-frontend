import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-request-details',
  templateUrl: './user-request-details.component.html',
  styleUrls: ['./user-request-details.component.css']
})
export class UserRequestDetailsComponent {
  requestDetails: any;
  requestId = 0;
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;

  constructor(
    private requestService: SolicitudService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.requestId = this.route.snapshot.params['solicitudId'];
    console.log(this.requestId)
    combineLatest([this.requestService.obtenerSolicitud(this.requestId)]).subscribe(
      ([requestDetails]: [any]) => {
        this.requestDetails = requestDetails;
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
