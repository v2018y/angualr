import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Bar } from "../classes/bar";
import { Store } from "../classes/store";
import { TokenApiServices } from "./token.services";
import { OnlineProcess } from "./process";

@NgModule({
  imports: [CommonModule]
})
@Injectable()
export class barApiServices {
  requestPath = "http://vany-hotel-api.herokuapp.com";
  //requestPath='http://localhost:8080'
  constructor(
    private store: Store,
    private tokenService: TokenApiServices,
    private process: OnlineProcess
  ) { }

  getHeaders(): HttpHeaders {
    let token = this.tokenService.getToken();
    let headers = new HttpHeaders().set("authorization", "Bearer " + token);
    return headers;
  }

  error(err) {
    console.error(" In Bar Services Error Occured ", err);
  }

  getAllData(value): Observable<any> {
    if (this.store.getBarItem() && value !== "True") {
      return new Observable(observer => { observer.next(this.store.getBarItem())});
    } else {
      var sub = new Subject<any>();
      this.process.execute("GET", this.requestPath + "/api/bar", {headers: this.getHeaders()})
        .subscribe(
          data => {
            this.store.saveBarItem(data);
            sub.next(this.store.getBarItem());
          },
          err => {
            sub.error(err);
          });
      return sub.asObservable();
    }
  }

  getAllBarData(): Observable<any> {
    return this.process.execute("GET", this.requestPath + "/api/bar", {headers: this.getHeaders()});
  }

  getBarDataById(id: number): Observable<any> {
    return this.process.execute("GET", this.requestPath + "/api/bar/" + id, {headers: this.getHeaders()});
  }

  saveData(data: Bar): Observable<any> {
    console.log("Calling Save Data", data);
    var subj = new Subject<any>();
    this.process.execute("POST", this.requestPath + "/api/bar/save", {headers: this.getHeaders(),body: data})
      .subscribe(
        response => {
          this.getAllData("True").subscribe(
            response => {
              subj.next(this.store.getBarItem());
            },
            err => {subj.next(err)})
        },
        err => {subj.error(err)});
    return subj.asObservable();
  }

  updateData(data: Bar, id: number): Observable<any> {
    console.log("Calling Update Data", data);
    var subj = new Subject<any>();
    this.process.execute("PUT", this.requestPath + "/api/bar/" + id, {headers: this.getHeaders(),body: data})
      .subscribe(response => {
        this.getAllData("True").subscribe(
          response => { subj.next(this.store.getBarItem())},
          err => {subj.error(err)});
      });
    return subj.asObservable();
  }

  deleteData(id: number): Observable<any> {
    console.log("Delete Method Call for this id " + id);
    var subj = new Subject<any>();
    this.process.execute("DELETE", this.requestPath + "/api/bar/" + id, {headers: this.getHeaders()})
      .subscribe(
        response => {console.log("deleted ", response)},
        err => {
          if (err.status === 200) {
            this.getAllData("True").subscribe(
              response => {subj.next(this.store.getBarItem())},
              err => {subj.error(err)});
          } else {subj.error(err)}
        }); 
    return subj.asObservable();
  }
}
