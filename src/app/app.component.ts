import { Component ,OnInit } from '@angular/core';
import { TokenApiServices } from './shared/services/token.services';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit{

  loading=true;
  loging=false;
  username;
  password;

  constructor(private tokenService:TokenApiServices){}
  ngOnInit() {
    if(this.tokenService.getToken()){
      this.loading=false;
    }
  }

  onDataSubmit(){
    if(this.username && this.password){
      this.loging=true;
      this.tokenService.getTokenSerivce(this.username,this.password)
      .subscribe(
        response =>{
          if(response.status === 401){
            alert("You enter Username And Password is Worng.")
            this.loading=true;
          }else{
            this.loading=false;
          }
        },err =>{console.error('Error Occured',err.status)}
      );
    }else{
      alert("Please Enter Valid Username and Password in following Fileds")
    }
  }


}
