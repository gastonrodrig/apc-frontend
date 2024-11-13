import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http:HttpClient) { }

  public listarInventario(){
    return this.http.get(`${baserUrl}/inventario/`);
  }

  public agregarProductoInventario(productoInventario:any){
    return this.http.post(`${baserUrl}/inventario/`, productoInventario);
  }

  public eliminarProductoInventario(productoInventarioId:any){
    return this.http.delete(`${baserUrl}/inventario/${productoInventarioId}`);
  }
  
  public obtenerProductoInventario(productoInventarioId:any){
    return this.http.get(`${baserUrl}/inventario/${productoInventarioId}`);
  }
  
  public actualizarProductoInventario(productoInventario:any){
    return this.http.put(`${baserUrl}/inventario/`, productoInventario);
  }

}
