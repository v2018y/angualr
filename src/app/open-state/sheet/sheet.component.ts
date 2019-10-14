import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { barApiServices } from "../../shared/services/bar.services";
import { TokenApiServices } from "app/shared/services/token.services";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";


@Component({
  selector: "app-sheet",
  moduleId: module.id,
  templateUrl: "sheet.component.html"
})
export class SheetComponent implements OnInit {
  itemType = ["Bear", "wine"];
  itemSizeBeer = ["1500","1000", "650", "500", "330", "325"];
  itemSizeWine=["750","375","180"]
  loading = true;
  userDate: String;
  getFilterDataByOpenState;
  getBarItemData;
  itemNameArray;
  itemtd;

  constructor(
    private barApiServices: barApiServices,
    private route: ActivatedRoute,
    private tokenservices: TokenApiServices
  ) { this.route.params.subscribe(param => {this.userDate = param.date})}

  ngOnInit() {
    this.barApiServices.getAllBarData().subscribe(
      data => {
        this.getBarItemData = data;
        this.loading = false;
        // This Method Processing the Sheet
        this.processing(this.getBarItemData);
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
  // This Method Take input Bar item data and call the load Tabel For Creating The Dynamic Rows
  processing(barItemData) {
    const data = barItemData.map((barItem, key) => {
      const temp = barItem.openState.filter(x => x.createdAt === this.userDate);
      return {
        openQty: temp[0] === undefined ? "" : temp[0].openQty,
        itemId: barItem.itemId,
        itemName: barItem.itemName,
        itemSize: barItem.itemSize,
        itemType: barItem.itemType
      };
    });
    // This Line Stored Filtter Data form Bar item Data
    this.getFilterDataByOpenState = data;
    // This Line Get Distinct Data Form FillterData Array (Means Get Distinct Bar Items)
    this.itemNameArray = Array.from( new Set(this.getFilterDataByOpenState.map(s => s.itemName)));
    // This Line Call For the Crating Dynamic Rows its take input as ItemArray Distinct Values
    this.loadTable(this.itemNameArray, this.getFilterDataByOpenState);
  }

  // This Method Create Dynamic Rows For Laoding Sheet Table
  loadTable(itemNameArray, getFilterDataByOpenState) {
    // This  Maping Geting How Many Rows We Need to Create Means Rows Count With Values Filterd On Main Bar item Filleted Array
    const rowsCount = itemNameArray.map((name, key) => { return getFilterDataByOpenState.filter(x => x.itemName === name) });
    // This Line return the Dynamic Rows Wtih There Qty.
    const printRows = rowsCount.map((row, key) => {
      const tempRow = row.flat();
      if (row[0].itemType === "Wine") {
        return (
          "<td>" +row[0].itemName +"</td>" +"<td></td>" +"<td></td>" +"<td></td>" +"<td></td>" +"<td></td>" +"<td></td>" 
          +"<td>" +this.fetchQty(tempRow, "750") +"</td>"
          +"<td>" +this.fetchQty(tempRow, "375") +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "180") +"</td>" 
        );
      } else {
        return (
          "<td>" +row[0].itemName +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "1500") +"</td>"
          +"<td>" +this.fetchQty(tempRow, "1000") +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "650") +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "500") +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "330") +"</td>" 
          +"<td>" +this.fetchQty(tempRow, "325") +"</td>" 
          +"<td></td>" +"<td></td>" +"<td></td>"
        );
      }
    });
    // This Line Will Stored the Dynamic Rows into Array
    this.itemNameArray = printRows;
  }
  // This Method take Two Prarameter and Return The Qty By Using Array Find Method
  fetchQty(row, value) {
    const temp = row.find(x => x.itemSize === value);
    return temp === undefined ? "" : temp.openQty;
  }

  public exportAsExcelFile(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet( document.getElementById("OpenState"));
    const workbook: XLSX.WorkBook = {
      Sheets: { BarSheetData: worksheet },
      SheetNames: ["BarSheetData"]
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, new Date().toDateString());
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs( data,fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
  }
}
