import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private http:HttpClient) { }

  public listarDepartments(){
    return this.http.get(`${baserUrl}/departments/`);
  }
}