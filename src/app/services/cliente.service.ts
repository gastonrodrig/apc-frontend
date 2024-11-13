import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http:HttpClient) { }

  public listarClientes(){
    return this.http.get(`${baserUrl}/clientes/`);
  }

  public agregarCliente(cliente:any){
    return this.http.post(`${baserUrl}/clientes/`, cliente);
  }
  public eliminarCliente(clienteId:any){
    return this.http.delete(`${baserUrl}/clientes/${clienteId}`);
  }

  public obtenerCliente(clienteId:any){
    return this.http.get(`${baserUrl}/clientes/${clienteId}`);
  }
  
  public actualizarCliente(cliente:any){
    return this.http.put(`${baserUrl}/clientes/`, cliente);
  }
}