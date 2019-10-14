import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OpenState } from '../classes/openState';
import { OnlineProcess } from './process';
import { TokenApiServices } from './token.services';

@NgModule({
    imports: [
      CommonModule
    ]
  })

@Injectable()
export class openStateApiServices {
    requestPath='http://vany-hotel-api.herokuapp.com'
    //  requestPath='http://localhost:8080'

  constructor(private process: OnlineProcess,private tokenService:TokenApiServices) { }

  getHeaders(): HttpHeaders{
    let token =this.tokenService.getToken();
    let headers=new HttpHeaders().set('authorization','Bearer '+token)
    return headers;
  }

  getAllOpenStateData(): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/openState/',{headers : this.getHeaders()});
  }

  getAllOpenStateDataByDate(userDate: String): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/openState/date/'+userDate,{headers : this.getHeaders()});
  }

  getOpenStateDataById(openStateId: number): Observable<any> {
    return this.process.execute("GET",this.requestPath+'/api/bar/openState/id/'+openStateId,{headers : this.getHeaders()});
  }

  saveData(itemId: number, data: OpenState): Observable<any> {
    return this.process.execute("POST",this.requestPath+'/api/bar/' + itemId + '/openState/save',{headers : this.getHeaders(),body : data});
  }

  saveAllData(itemId: number, data: OpenState): Observable<any> {
    return this.process.execute("POST",this.requestPath+'/api/bar/' + itemId + '/openState/saveAll',{headers : this.getHeaders(),body : data});
  }

  updateData(itemId: number, openStateId: number, data: OpenState): Observable<any> {
    return this.process.execute("PUT",this.requestPath+'/api/bar/' + itemId + '/openState/' + openStateId,{headers : this.getHeaders(),body : data})
  }

  deleteData(itemId: number, openStateId: number): Observable<any> {
    return this.process.execute("DELETE",this.requestPath+'/api/bar/' + itemId + '/openState/'+ openStateId,{headers : this.getHeaders()});
  }
}