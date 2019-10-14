import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Store } from "../classes/store";
import { OnlineProcess } from "./process";

@NgModule({
    imports: [CommonModule]
})
@Injectable()
export class TokenApiServices {
    reqPath = "http://vany-hotel-api.herokuapp.com";
    //  reqPath='http://localhost:8080';
    constructor(private store: Store, private process: OnlineProcess) { }

    // This method Get Tokens Form URL and Store into Session Stroage.
    getTokenSerivce(username, password): Observable<any> {
        const options = {
            body: {
                username: username,
                password: password
            }
        };
        var sub = new Subject<any>();
        this.process
            .execute("POST", this.reqPath + "/oauth/token", options)
            .subscribe(
                response => {
                    this.store.saveToken(response);
                    sub.next(response);
                },
                err => {
                    console.error("Error Occured : ", err);
                    sub.next(err);
                }
            );
        return sub.asObservable();
    }

    // This Method use-full when our token is expried. To get new Token This method usefull.
    refreshToeknService(): Observable<any> {
        let token = this.store.getToken();
        const headers = new HttpHeaders({ refresh: token.refreshToken });
        var sub = new Subject<any>();
        this.process
            .execute("GET", this.reqPath + "/oauth/token", { headers })
            .subscribe(
                response => {
                    this.store.saveToken(response);
                    sub.next(response);
                },
                err => {
                    console.error("Error Occured : ", err);
                    sub.next(err);
                }
            );
        return sub.asObservable();
    }

    // This Method retrun the token form storage.
    getToken() {
        if (this.store.getToken() === null) {
            console.log("There is No Token, Please Logout and Login again....");
            return null;
        } else {
            let tokenTemp = this.store.getToken();
            return tokenTemp.token;
        }
    }
}
