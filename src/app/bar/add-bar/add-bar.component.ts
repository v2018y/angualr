import { Component, OnInit } from "@angular/core";
import { Bar } from "../../shared/classes/bar";
import { barApiServices } from "../../shared/services/bar.services";
import { TokenApiServices } from "app/shared/services/token.services";

@Component({
  selector: "app-add-bar",
  moduleId: module.id,
  templateUrl: "add-bar.component.html"
})
export class AddBarComponent implements OnInit {
  constructor(
    private barApiServices: barApiServices,
    private tokenservices: TokenApiServices
  ) { }

  userBar = new Bar();
  loading = false;
  bottels =[{id:"Kingfisher",title:"Kingfisher"},
  {id:"Tuborg",title:"Tuborg"},
  {id:"Carlsberg",title:"Carlsberg"},
  {id:"Budweiser",title:"Budweiser"},
  {id:"Heineken",title:"Heineken"},
  {id:"Haywards 5000",title:"Haywards 5000"},
  {id:"Godfathers",title:"Godfathers"},
  {id:"Fosters",title:"Fosters"},
  {id:"Corona",title:"Corona"},
  {id:"Miller",title:"Miller"},
  {id:"Cobra",title:"Cobra"},
  {id:"Daredevil",title:"Daredevil"},
  {id:"Kings",title:"Kings"},
  {id:"Bira",title:"Bira"}]

  ngOnInit() { 
    if(this.userBar){
      this.userBar.itemName=""
    }
  }
  
  // This Method Call when Submit Button Called
  onDataSubmit() {
    this.loading = true;
    this.barApiServices.saveData(this.userBar).subscribe(
      data => {
        this.userBar = data;
        alert("Data inserted Successfully");
        this.loading = false;
        window.location.href = "/bar";
      },
      err => {
        console.log('Status : ',err.status);
        if (err.status === 401) {
          this.tokenservices.refreshToeknService().subscribe(
            response => {
              this.onDataSubmit();
            },
            err => {
              console.error("Error Occured : ", err);
            });
        }
      }
    );
  }
}
