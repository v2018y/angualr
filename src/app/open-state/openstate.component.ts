import { Component, OnInit } from "@angular/core";
import { openStateApiServices } from "app/shared/services/openState.services";
import { TokenApiServices } from "app/shared/services/token.services";

@Component({
  selector: "app-open-state",
  moduleId: module.id,
  templateUrl: "openstate.component.html"
})
export class OpenStateComponent implements OnInit {
  constructor(
    private openStateService: openStateApiServices,
    private tokenservices: TokenApiServices
  ) { }

  loading = true;
  openStateData: OpenStateComponent;
  openStateDummy;

  ngOnInit() {
    this.openStateService.getAllOpenStateData()
    .subscribe(
      data => {
        const dummy = Array.from(new Set(data.map(s => s.createdAt))).map( (createdAt, key) => { return { id: key, date: data.find(s => s.createdAt === createdAt).createdAt } } );
        this.openStateDummy = dummy;
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
      });
  }
}
