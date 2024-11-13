import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent {

  nOperacion: any
  fechaOperacion: any
  hourMinutes: any
  maxDate = new Date()

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataTipoPago: any,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    private snack: MatSnackBar,
  ) {}

  closeModel() {
    this.dialogRef.close()
    this.snack.dismiss()
  }

  formatHour() {
    this.hourMinutes = this.hourMinutes.replace(/\D/g, '');
    if (this.hourMinutes.length > 2) {
      this.hourMinutes = this.hourMinutes.substring(0, 2) + ':' + this.hourMinutes.substring(2, 4);
    } else if (this.hourMinutes.length > 0) {
      this.hourMinutes = this.hourMinutes.substring(0, 2);
    }
  }

  registrarPago() {
    if (this.nOperacion === '' || this.nOperacion == null) {
      this.snack.open('El número de operación es requerido', '', {
        duration: 3000
      });
      return;
    }

    if (this.fechaOperacion === '' || this.fechaOperacion == null) {
      this.snack.open('La fecha de operación es requerida', '', {
        duration: 3000
      });
      return;
    }

    const hourMinutesRegex = /\b\d{2}:\d{2}\b/;
    if (!hourMinutesRegex.test(this.hourMinutes)) {
      this.snack.open('Formato inválido de la hora y los minutos', '', {
        duration: 3000
      });
      return;
    }

    const now = new Date();
    const inputDate = new Date(this.fechaOperacion);
    const [hours, minutes] = this.hourMinutes.split(':');
    inputDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    
    if (inputDate > now) {
      this.snack.open('La fecha y hora ingresadas no pueden ser mayores que la fecha y hora actuales', '', {
        duration: 3000
      });
      return;
    }

    Swal.fire('Pago registrado', 'El pago ha sido guardado con éxito', 'success').
      then((e) => {
        this.dialogRef.close({ 
          data: {
            nOperacion: this.nOperacion,
            fechaOperacion: this.fechaOperacion,
            hourMinutes: this.hourMinutes
          }
        })
      });
  }
}
