import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class OrdersDetailsService {

  constructor(private http:HttpClient) { }

  public listarOrdersDetails(){
    return this.http.get(`${baserUrl}/ordersdetails/`);
  }

  public agregarOrdersDetail(ordersdetails:any){
    return this.http.post(`${baserUrl}/ordersdetails/`, ordersdetails);
  }
  
  public eliminarOrdersDetail(ordersdetailsId:any){
    return this.http.delete(`${baserUrl}/ordersdetails/${ordersdetailsId}`);
  }
  
  public obtenerOrderDetail(ordersdetailsId:any){
    return this.http.get(`${baserUrl}/ordersdetails/${ordersdetailsId}`);
  }
  
  public actualizarOrderDetail(ordersdetails:any){
    return this.http.put(`${baserUrl}/ordersdetails/`, ordersdetails);
  }

  public listarOrdersDetailsByOrder(orderId:any){
    return this.http.get(`${baserUrl}/ordersdetails/order/${orderId}`);
  }

}