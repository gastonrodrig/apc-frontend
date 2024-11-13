import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  constructor(private http: HttpClient) {}

  handlePayment() {
    this.http.post('http://localhost:8080/api/create-preference', {})
      .subscribe((response: any) => {
        const script = document.createElement('script');
        script.src = "https://www.mercadopago.com.pe/integrations/v1/web-payment-checkout.js";
        script.type = "text/javascript";
        script.dataset['preferenceId'] = response['preferenceId'];
        const checkoutContainer = document.getElementById('checkout-container');
        if (checkoutContainer) {
          checkoutContainer.appendChild(script);
        } else {
          console.error('checkout-container no encontrado');
        }
      }, error => {
        console.error('Error en la creación de la preferencia', error);
      });
  }
}
