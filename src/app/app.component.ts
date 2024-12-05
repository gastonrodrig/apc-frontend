import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hideNavbar: boolean = false; // Variable para controlar la visibilidad del navbar

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Escucha los cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Lista de rutas donde no se debe mostrar el navbar
        const noNavbarRoutes = ['/login', '/signup']; 
        this.hideNavbar = noNavbarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
