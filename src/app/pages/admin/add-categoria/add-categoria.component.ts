import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.component.html',
  styleUrls: ['./add-categoria.component.css']
})
export class AddCategoriaComponent implements OnInit {

  categoriaData = {
    nombre: '',
    descripcion: '',
    dateCreated: '',
    status: ''
  };

  constructor(
    private snack: MatSnackBar,
    private categoriaService: CategoriaService,
    private router: Router) { }
  ngOnInit(): void {

  }
  volverACategorias() {
    this.router.navigate(['/admin/categorias']); 
  }
  guardarInformacion() {
    console.log(this.categoriaData);
    if (this.categoriaData.nombre.trim() === '' || this.categoriaData.nombre == null) {
      this.snack.open('El nombre es requerido', '', {
        duration: 3000
      });
      return;
    }
  
    if (this.categoriaData.descripcion.trim() === '' || this.categoriaData.descripcion == null) {
      this.snack.open('La descripción es requerida', '', {
        duration: 3000
      });
      return;
    }

    // Obtener la fecha actual
    this.categoriaData.dateCreated = this.getCurrentDate();
    this.categoriaData.status = 'Activo'; // Establecer el estado como 'Activo'

    // Continuar con el resto del código para guardar la categoría
    this.categoriaService.listarCategorias().subscribe(
      (categorias: any) => {
        const existeNombre = categorias.some((categoria: any) => categoria.nombre.trim().toLowerCase() === this.categoriaData.nombre.trim().toLowerCase());

        if (existeNombre) {
          this.snack.open('Ya existe una categoría con el mismo nombre', '', {
            duration: 3000
          });
        } else {
          // Si no existe un producto con el mismo nombre ni SKU, proceder con la inserción
          this.categoriaService.agregarCategoria(this.categoriaData).subscribe(
            (data) => {
              console.log(data);
              Swal.fire('Categoría guardada', 'La categoría ha sido guardada con éxito', 'success');
              this.categoriaData = { // Reiniciar los datos después de guardar
                nombre: '',
                descripcion: '',
                dateCreated: '',
                status: ''
              };
              this.router.navigate(['/admin/categorias']);
            },
            (error) => {
              Swal.fire('Error', 'Error al guardar la información de la categoría', 'error');
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener la lista de categorías:', error);
        this.snack.open('Error al obtener la lista de categorías', '', {
          duration: 3000
        });
      }
    );
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}