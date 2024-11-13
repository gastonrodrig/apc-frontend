import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-categoria',
  templateUrl: './actualizar-categoria.component.html',
  styleUrls: ['./actualizar-categoria.component.css']
})
export class ActualizarCategoriaComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private router: Router) { }

  categoriaId = 0;
  categoria: any;
  categoriaOriginal: any;

  ngOnInit(): void {
    this.categoriaId = this.route.snapshot.params['categoriaId'];
    this.categoriaService.obtenerCategoria(this.categoriaId).subscribe(
      (data) => {
        this.categoria = data;
        this.categoriaOriginal = { ...this.categoria }; // Hacemos una copia de los datos de la categoría para poder hacer una validación de cambio.
        console.log(this.categoria)
        console.log(this.categoriaOriginal)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  volverACategorias() {
    this.router.navigate(['/admin/categorias']); 
  }
  normalizarEspacios(cadena: string): string {
    return cadena.replace(/\s+/g, ' ').trim();
  }
  public actualizarDatos(){
    // Normalizamos espacios en blanco en las cadenas y eliminar espacios al inicio y al final
    this.categoria.nombre = this.normalizarEspacios(this.categoria.nombre);
    this.categoria.descripcion = this.normalizarEspacios(this.categoria.descripcion);
  
    console.log(this.categoria);
  
    if (!this.categoria.nombre || !this.categoria.descripcion) {
      this.snack.open('El nombre de la categoría y la descripción son requeridos', '', {
        duration: 3000
      });
      return;
    }
   
    const nombreModificado = this.categoria.nombre.trim().toLowerCase() !== this.categoriaOriginal.nombre.trim().toLowerCase();
    console.log(nombreModificado);
  
    if (nombreModificado) {
      // Si se han modificado el nombre de producto o el SKU, proceder con la validación
      this.categoriaService.listarCategorias().subscribe(
        (categorias: any) => {
          if (nombreModificado) {
            const existeNombre = categorias.some((categoria: any) => categoria.nombre.trim().toLowerCase() === this.categoria.nombre.trim().toLowerCase() && categoria._id !== this.categoriaId);
            if (existeNombre) {
              this.snack.open('Ya existe una categoría con el mismo nombre', '', {
                duration: 3000
              });
              return;
            }
          }
  
          // Si no existe una categoría con el mismo nombre, proceder con la actualización
          this.categoriaService.actualizarCategoria(this.categoria).subscribe(
            (data) => {
              Swal.fire('Categoría actualizada', 'La categoría ha sido actualizada con éxito', 'success').then(
                (e)=> {
                  this.router.navigate(['/admin/categorias']);
                }
              );
            },
            (error) =>{
              Swal.fire('Error en el sistema', 'No se ha podido actualizar la información de la categoría', 'error');
              console.log(error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener la lista de categorías:', error);
          this.snack.open('Error al obtener la lista de categorías', '', {
            duration: 3000
          });
        }
      );
    } else {
      // Si no se han modificado el nombre, no se realiza la validación
      this.categoriaService.actualizarCategoria(this.categoria).subscribe(
        (data) => {
          Swal.fire('Categoría actualizada', 'La categoría ha sido actualizado con éxito', 'success').then(
            (e)=> {
              this.router.navigate(['/admin/categorias']);
            }
          );
        },
        (error) =>{
          Swal.fire('Error en el sistema', 'No se ha podido actualizar la información de la categoría', 'error');
          console.log(error);
        }
      );
    }
  }
}