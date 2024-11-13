import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http:HttpClient) { }

  public listarCategorias(){
    return this.http.get(`${baserUrl}/categorias/`);
  }

  public agregarCategoria(categoria:any){
    return this.http.post(`${baserUrl}/categorias/`, categoria);
  }
  public eliminarCategoria(categoriaId:any){
    return this.http.delete(`${baserUrl}/categorias/${categoriaId}`);
  }

  public obtenerCategoria(categoriaId:any){
    return this.http.get(`${baserUrl}/categorias/${categoriaId}`);
  }
  
  public actualizarCategoria(categoria:any){
    return this.http.put(`${baserUrl}/categorias/`, categoria);
  }
}