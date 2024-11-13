import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css']
})
export class UserWelcomeComponent {
  isLoggedIn = false;
  user:any = null;
  calendar: number[][] = [];

  isCurrentDay(day: number): boolean {
    return day === new Date().getDate();
  }

  getCurrentMonthAndYear(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const today = new Date();
    return `${months[today.getMonth()]} de ${today.getFullYear()}`;
  }

  constructor(public login:LoginService) { 
    const today = new Date();

    // Obtener el mes y el año actual
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Obtener el primer y último día del mes
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

    let dayCounter = 1;
    let week: number[] = [];

    // Rellenar la matriz con los días del mes
    for (let i = 0; i < 5; i++) {
      week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          // Rellenar los días antes del primer día del mes con ceros
          week.push(0);
        } else if (dayCounter > lastDay) {
          // Rellenar los días después del último día del mes con ceros
          week.push(0);
        } else {
          // Agregar el día actual al calendario
          week.push(dayCounter);
          dayCounter++;
        }
      }
      this.calendar.push(week);
    }
    
    
  
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
  }

  public logout(){
    this.login.logout();
    window.location.reload();
  }
}
