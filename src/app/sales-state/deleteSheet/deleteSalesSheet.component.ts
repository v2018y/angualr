import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs/observable/forkJoin";
import { barApiServices } from "../../shared/services/bar.services";
import { SalesStateApiServices } from "app/shared/services/salesState.services";
import { TokenApiServices } from "app/shared/services/token.services";
@Component({
  selector: "app-sheet",
  moduleId: module.id,
  templateUrl: "deleteSalesSheet.component.html"
})
export class DeleteSalesSheetComponent implements OnInit {
  itemSizeBeer = ["1500", "1000", "650", "500", "330", "325"];
  itemSizeWine = ["750", "375", "180"];
  loading = true;
  barItemData;
  userDate: String;
  getFilterDataBySalesState;
  getBarItemData;
  itemNameArray;
  itemtd;

  constructor(
    private barApiServices: barApiServices,
    private salesStateServices: SalesStateApiServices,
    private route: ActivatedRoute,
    private tokenservices: TokenApiServices) { this.route.params.subscribe(param => { this.userDate = param.date }) }

  ngOnInit() {
    this.barApiServices.getAllBarData().subscribe(
      response => {
        this.barItemData = response;
        this.processing(this.barItemData, this.userDate);
        this.loading = false;
      },
      err => {
        console.log("Status : ", err.status);
        if (err.status === 401) {
          this.tokenservices.refreshToeknService().subscribe(
            response => { this.ngOnInit() },
            err => { console.error("Error Occured : ", err) }
          );
        }
      });
  }
  //  This Method Processing Your HTML Table
  processing(mainBarData, userDate) {
    const tempdata = mainBarData.map((item, key) => {
      const data = item.salesSateBar.filter(x => x.createdAt === userDate);
      return {
        salesId: data[0] === undefined ? "" : data[0].salesId,
        salesQty: data[0] === undefined ? "" : data[0].salesQty,
        itemId: item.itemId,
        itemName: item.itemName,
        itemSize: item.itemSize,
        itemType: item.itemType
      };
    });
    // This Line Stored The Custom Rows Fetching Form Api Data
    this.getFilterDataBySalesState = tempdata;
    // This Line Get Distinct Value Form Geting Rows
    this.itemNameArray = Array.from( new Set(this.getFilterDataBySalesState.map(s => s.itemName)));
    // This Line load Html table On Document
    this.loadTable(this.itemNameArray, this.getFilterDataBySalesState);
  }

  loadTable(itemNameArray, getFilterDataBySalesState) {
    // This  Maping Geting How Many Rows We Need to Create Means Rows Count With Values Filterd On Main Bar item Filleted Array
    const rowsCount = itemNameArray.map((name, key) => {
      return getFilterDataBySalesState.filter(x => x.itemName === name);
    });
    // This Line return the Dynamic Rows Wtih There Qty.
    const printRows = rowsCount.map((row, key) => {
      const tempRow = row.flat();
      return {
        name: row[0].itemName,
        "1500": this.fetchQty(tempRow, "1500"),
        "1000": this.fetchQty(tempRow, "1000"),
        "650": this.fetchQty(tempRow, "650"),
        "500": this.fetchQty(tempRow, "500"),
        "330": this.fetchQty(tempRow, "330"),
        "325": this.fetchQty(tempRow, "325"),
        "750": this.fetchQty(tempRow, "750"),
        "375": this.fetchQty(tempRow, "375"),
        "180": this.fetchQty(tempRow, "180")
      };
    });
    // This Line Will Stored the Dynamic Rows into Array
    this.itemNameArray = printRows;
  }
  // This Method take Two Prarameter and Return The Qty By Using Array Find Method
  fetchQty(row, value) {
    const temp = row.find(x => x.itemSize === value);
    return temp === undefined ? "" : temp.salesQty;
  }

  // This Functions Delete Our Sales Sheet.
  deleteSheet() {
    if (confirm("Are Sure Want To Delete this Sheet Data !!!")) {
      this.loading = true;
      // This Line Make All Observale For Deleting 
      const deleteOpt = this.getFilterDataBySalesState.map((item, key) => { return this.salesStateServices.deleteData(item.itemId, item.salesId) });
      // This Functions Exceute All Observale Created Above Line Symtionusly.
      forkJoin(deleteOpt).subscribe(
        response => { console.log(response) },
        err => {
          if (err.status === 200) {
            alert("Your Bar Item Deleted Successfully");
            this.loading = false;
            window.location.href = "/SalesState";
          } else { console.error("Error Occured : ", err) }
        });
    }
  }
}
