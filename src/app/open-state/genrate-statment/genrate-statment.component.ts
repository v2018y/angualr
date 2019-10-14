import { Component, OnInit } from "@angular/core";
import { Bar } from "../../shared/classes/bar";
import { openStateApiServices } from "../../shared/services/openState.services";
import { barApiServices } from "../../shared/services/bar.services";
import { forkJoin } from "rxjs/observable/forkJoin";
import { TokenApiServices } from "app/shared/services/token.services";
@Component({
  selector: "app-genrate-statment",
  moduleId: module.id,
  templateUrl: "genrate-statment.component.html"
})
export class GenrateStatmentComponent implements OnInit {
  lstBarData: Bar[];
  userDate;
  postOpenStateData = [];
  loading = true;
  constructor(
    private barApiServices: barApiServices,
    private openStateServices: openStateApiServices,
    private tokenservices :TokenApiServices
  ) {}

  ngOnInit() {
    this.barApiServices.getAllBarData().subscribe(
      response => {
        this.lstBarData = response;
        this.loading = false;
      },
      err => {
        console.log("Status : ", err.status);
        if (err.status === 401) {
          this.tokenservices.refreshToeknService().subscribe(
            response => {
              this.ngOnInit();
            },
            err => {
              console.error("Error Occured : ", err);
            });
        }
      }
    );
  }

  exist(item) { return this.postOpenStateData.indexOf(item) > -1 }

  toggleSelections(item) {
    var idx = this.postOpenStateData.indexOf(item);
    if (idx > -1) {
      this.postOpenStateData.splice(idx, 1);
    } else {
      this.postOpenStateData.push(item);
    }
  }

  // when You Click on Checkbox that time this functions called
  changeValue(item: Bar) {
    var idx = this.postOpenStateData.findIndex( items => item.itemId === items.itemId);
    if (this.userDate === undefined) {
      alert("Please Select Date First");
      return null;
    } else if (idx > -1) {
      const temp = this.postOpenStateData.filter( items => item.itemId !== items.itemId);
      this.postOpenStateData = temp;
    } else {
      this.postOpenStateData.push({openQty: item.itemQty,itemId: item.itemId,createdAt: this.userDate});
    }
  }

  // When Submit Button click this Functions Called
  onSubmitPostData() {
    if (this.postOpenStateData.length === 0) {
      alert("Please Select one of the Check bos from below Table");
    } else {
      this.loading = true;
      const insertOpt = this.postOpenStateData.map(item => {
        return this.openStateServices.saveData(item.itemId, item);
      });
      forkJoin(insertOpt).subscribe(
        response => {
          this.loading = false;
          alert("Your Data Inserted Successfully");
          window.location.href = "/OpenState";
        },
        err => {
          console.log("Status : ", err.status);
          if (err.status === 401) {
            this.tokenservices.refreshToeknService().subscribe(
              response => {
                this.onSubmitPostData();
              },
              err => {
                console.error("Error Occured : ", err);
              });
          }
        }
      );
    }
  }
}
