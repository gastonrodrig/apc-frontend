import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http:HttpClient) { }

  public listarProductosCatalogo(){
    return this.http.get(`${baserUrl}/catalogo/`);
  }

  public agregarProductoCatalogo(productoCatalogo:any){
    return this.http.post(`${baserUrl}/catalogo/`, productoCatalogo);
  }
  
  public eliminarProductoCatalogo(productoCatalogoId:any){
    return this.http.delete(`${baserUrl}/catalogo/${productoCatalogoId}`);
  }
  
  public obtenerProductoCatalogo(productoCatalogoId:any){
    return this.http.get(`${baserUrl}/catalogo/${productoCatalogoId}`);
  }
  
  public actualizarProductoCatalogo(productoCatalogo:any){
    return this.http.put(`${baserUrl}/catalogo/`, productoCatalogo);
  }

}
