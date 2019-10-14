import { Component, OnInit } from "@angular/core";
import { Bar } from "../shared/classes/bar";
import { barApiServices } from "../shared/services/bar.services";
import { Store } from "../shared/classes/store";
import { TokenApiServices } from "app/shared/services/token.services";

declare var $: any;

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "bar.component.html"
})
export class BarComponent implements OnInit {
  constructor(
    private barApiServices: barApiServices,
    private store: Store,
    private tokenServices: TokenApiServices
  ) {}

  lstBarData: Bar[];
  loading = true;
  
  ngOnInit() {
    this.barApiServices.getAllData(null).subscribe(
      response => {
        this.store.saveBarItem(response);
        this.lstBarData = response;
        this.loading = false;
      },
      err => {
        console.log("Status : ", err.status);
          if (err.status === 401) {
            this.tokenServices.refreshToeknService().subscribe(
              response => {
                this.ngOnInit();
              },
              err => {
                console.error("Error Occured : ", err);
              });
          }
      });
    $(document).ready(() => {
      console.log("Welcome to Yogesh Bar Management Software ");
    });
  }

  onDeleteClick(id: number) {
    if (confirm("Are Sure Want To Delete this item !")) {
      this.loading = true;
      this.barApiServices.deleteData(id).subscribe(
        response => {
          console.log("Dleted Data : ", response);
          alert("Your Bar Item Deleted Successfully");
          window.location.reload();
          this.loading = false;
        },
        err => {
          console.log("Status : ", err.status);
          if (err.status === 401) {
            this.tokenServices.refreshToeknService().subscribe(
              response => {
                this.onDeleteClick(id);
              },
              err => {
                console.error("Error Occured : ", err);
              });
          }
        });
    }
  }
}
