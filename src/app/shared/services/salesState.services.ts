import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnlineProcess } from './process';
import { TokenApiServices } from './token.services';
import { SalesState } from '../classes/salesState';

@NgModule({
    imports: [
      CommonModule
    ]
  })

@Injectable()
export class SalesStateApiServices {
      requestPath='http://vany-hotel-api.herokuapp.com'
  //  requestPath='http://localhost:8080'

  constructor(private process: OnlineProcess,private tokenService:TokenApiServices) { }

  getHeaders(): HttpHeaders{
    let token =this.tokenService.getToken();
    let headers=new HttpHeaders().set('authorization','Bearer '+token)
    return headers;
  }

  getAllSalesStateData(): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/salesState/',{headers : this.getHeaders()});
  }

  getAllSalesStateDataByDate(userDate: String): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/salesState/date/'+userDate,{headers : this.getHeaders()});
  }

  getSalesStateDataById(salesStateId: number): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/salesState/id/'+salesStateId,{headers : this.getHeaders()});
  }

  saveData(itemId: number, data: SalesState): Observable<any> {
    return this.process.execute("POST",this.requestPath+'/api/bar/' + itemId + '/salesState/save',{headers : this.getHeaders(),body : data});
  }

  saveAllData(itemId: number, data: SalesState): Observable<any> {
    return this.process.execute("POST",this.requestPath+'/api/bar/' + itemId + '/salesState/saveAll',{headers : this.getHeaders(),body : data});
  }

  updateData(itemId: number, salesStateId: number, data: SalesState): Observable<any> {
    return this.process.execute("PUT",this.requestPath+'/api/bar/' + itemId + '/salesState/' + salesStateId,{headers : this.getHeaders(),body : data})
  }

  deleteData(itemId: number, salesStateId: number): Observable<any> {
    return this.process.execute("DELETE",this.requestPath+'/api/bar/' + itemId + '/salesState/'+ salesStateId,{headers : this.getHeaders()});
  }
}