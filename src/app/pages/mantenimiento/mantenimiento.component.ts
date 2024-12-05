import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  isLoggedIn = false; // Indica si el usuario ha iniciado sesión

  constructor(
    private login: LoginService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está logueado al cargar el componente
    this.isLoggedIn = this.login.isLoggedIn();
    
    // Suscribirse a los cambios en el estado de inicio de sesión
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
      }
    );
  }

  // Método que maneja el clic en el botón de cotización
  handleCotizaClick() {
    if (this.isLoggedIn) {
      // Si el usuario está logueado, redirigir al formulario
      this.router.navigate(['/formulario']);
    } else {
      // Si el usuario no está logueado, redirigir al login
      this.router.navigate(['/login']);
    }
  }
}
