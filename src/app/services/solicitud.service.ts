import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private http:HttpClient) { }

  public listarSolicitudes(){
    return this.http.get(`${baserUrl}/solicitud/`);
  }

  public agregarSolicitud(solicitud:any){
    return this.http.post(`${baserUrl}/solicitud/`, solicitud);
  }
  
  public eliminarSolicitud(solicitudId:any){
    return this.http.delete(`${baserUrl}/solicitud/${solicitudId}`);
  }
  
  public obtenerSolicitud(solicitudId:any){
    return this.http.get(`${baserUrl}/solicitud/${solicitudId}`);
  }
  
  public actualizarSolicitud(solicitud:any){
    return this.http.put(`${baserUrl}/solicitud/`, solicitud);
  }

  public listarSolicitudesByUser(userId:any){
    return this.http.get(`${baserUrl}/solicitud/user/${userId}`);
  }
}
