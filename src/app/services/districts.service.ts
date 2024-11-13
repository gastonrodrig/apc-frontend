import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {

  constructor(private http:HttpClient) { }

  public listarDistricts(){
    return this.http.get(`${baserUrl}/districts/`);
  }
}