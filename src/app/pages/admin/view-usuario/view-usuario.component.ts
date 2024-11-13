import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-view-usuario',
  templateUrl: './view-usuario.component.html',
  styleUrls: ['./view-usuario.component.css']
})
export class ViewUsuarioComponent implements OnInit {
  usuarios: any = [];
  currentPage1 = 1;
  rowsPerPage1 = 10;
  totalPages1 = 0;
  searchTerm1: string = ''; // Nueva propiedad para el término de búsqueda

  constructor(
    private userService: UserService
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
    this.totalPages1 = Math.ceil(this.filteredUsuarios().length / this.rowsPerPage1);
    if (this.currentPage1 > this.totalPages1) {
      this.currentPage1 = 1;
    }
  }

  displayedUsuarios(): any[] {
    const startIndex = (this.currentPage1 - 1) * this.rowsPerPage1;
    const endIndex = startIndex + this.rowsPerPage1;
    return this.filteredUsuarios().slice(startIndex, endIndex);
  }

  filteredUsuarios(): any[] {
    return this.usuarios.filter((usuario: any) =>
      usuario.nombre.toLowerCase().includes(this.searchTerm1.toLowerCase())
    );
  }

  ngOnInit(): void {
    combineLatest([this.userService.listarUsuarios()]).subscribe(
      ([usuarios]: [any]) => {
        this.usuarios = usuarios;
        this.calculateTotalPages1();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }
}
