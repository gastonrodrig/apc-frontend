import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http:HttpClient) { }

  public listarAlmacenes(){
    return this.http.get(`${baserUrl}/almacenes/`);
  }

  public agregarAlmacen(almacen:any){
    return this.http.post(`${baserUrl}/almacenes/`, almacen);
  }
  public eliminarAlmacen(almacenId:any){
    return this.http.delete(`${baserUrl}/almacenes/${almacenId}`);
  }

  public obtenerAlmacen(almacenId:any){
    return this.http.get(`${baserUrl}/almacenes/${almacenId}`);
  }
  
  public actualizarAlmacen(almacen:any){
    return this.http.put(`${baserUrl}/almacenes/`, almacen);
  }
}