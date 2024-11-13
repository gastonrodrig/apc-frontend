import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private http:HttpClient) { }

  public listarAddresses(){
    return this.http.get(`${baserUrl}/addresses/`);
  }

  public agregarAddress(address:any){
    return this.http.post(`${baserUrl}/addresses/`, address);
  }
  
  public eliminarAddress(addressId:any){
    return this.http.delete(`${baserUrl}/addresses/${addressId}`);
  }
  
  public obtenerAddress(addressId:any){
    return this.http.get(`${baserUrl}/addresses/${addressId}`);
  }
  
  public actualizarAddress(address:any){
    return this.http.put(`${baserUrl}/addresses/`, address);
  }

  public listarAddressesByUser(userId:any){
    return this.http.get(`${baserUrl}/addresses/user/${userId}`);
  }

}