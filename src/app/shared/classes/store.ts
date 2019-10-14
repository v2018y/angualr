import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { Bar } from '../classes/bar';

@NgModule({
    imports: [
      CommonModule
    ]
  })

@Injectable()
export class Store {

    saveBarItem(barData){
        sessionStorage.setItem("BARITEM",JSON.stringify(barData));
    }

    getBarItem(){
        const barData = sessionStorage.getItem("BARITEM")
        return JSON.parse(barData)
    }

    saveToken(tokenData){
      sessionStorage.setItem("AUTH",JSON.stringify(tokenData));
    }

    getToken(){
      const barData = sessionStorage.getItem("AUTH")
      return JSON.parse(barData)
    }

    clearData(){
      sessionStorage.removeItem("BARITEM");
      sessionStorage.removeItem("AUTH");
    }

}