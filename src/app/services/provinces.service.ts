import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {

  constructor(private http:HttpClient) { }

  public listarProvinces(){
    return this.http.get(`${baserUrl}/provinces/`);
  }
}