import { Component, OnInit } from "@angular/core";
import { SalesStateApiServices } from "app/shared/services/salesState.services";
import { ActivatedRoute } from "@angular/router";
import { TokenApiServices } from "app/shared/services/token.services";
import { barApiServices } from "app/shared/services/bar.services";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Component({
  selector: "app-open-state",
  moduleId: module.id,
  templateUrl: "salesState.component.html"
})
export class SalesSheetStateComponent implements OnInit {
  loading = true;
  itemSizeBeer = ["1500", "1000", "650", "500", "330", "325"];
  itemSizeWine = ["750", "375", "180"];
  barItemData;
  salesStateData;
  salesStateDummy;
  userDate;
  getFilterDataBySalesState;
  itemNameArray;

  constructor(
    private salesStateService: SalesStateApiServices,
    private route: ActivatedRoute,
    private tokenservices: TokenApiServices,
    private barApiServices: barApiServices) { this.route.params.subscribe(param => { this.userDate = param.date }) }

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
            err => { console.error("Error Occured : ", err)}
          );
        }
      });
  }
  // This Method Take input Bar item data and call the load Tabel For Creating The Dynamic Rows
  processing(mainBarData, userDate) {
    const tempdata = mainBarData.map((item, key) => {
      const data = item.salesSateBar.filter(x => x.createdAt === userDate);
      return {
        salesQty: data[0] === undefined ? "" : data[0].salesQty,
        itemId: item.itemId,
        itemName: item.itemName,
        itemSize: item.itemSize,
        itemType: item.itemType
      };
    });
     // This Line Stored Filtter Data form Bar item Data
    this.getFilterDataBySalesState = tempdata;
     // This Line Get Distinct Data Form FillterData Array (Means Get Distinct Bar Items)
    this.itemNameArray = Array.from( new Set(this.getFilterDataBySalesState.map(s => s.itemName)) );
     // This Line Call For the Crating Dynamic Rows its take input as ItemArray Distinct Values
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
  // This Functiosn Processing Your Html Table into Excel Sheet
  public exportAsExcelFile(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet( document.getElementById("SalesState") );
    const workbook: XLSX.WorkBook = { Sheets: { BarSheetData: worksheet }, SheetNames: ["BarSheetData"]};
    const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx",type: "array" });
    this.saveAsExcelFile(excelBuffer, "Sales Stock of " + this.userDate);
  }
 // This Functions Save Your Excel File on to System 
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs( data, fileName + "-export-" + new Date().toDateString() + EXCEL_EXTENSION);
  }
}
