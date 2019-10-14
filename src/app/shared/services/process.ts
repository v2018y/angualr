import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
@NgModule({
    imports: [
      CommonModule
    ]
  })

@Injectable()
export class OnlineProcess {
    
    constructor(private httpClient: HttpClient) { }

    execute(requestMethod,requestURL,requestOption){
        return this.httpClient.request(requestMethod,requestURL,requestOption)
      }
}