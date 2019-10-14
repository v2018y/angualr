import { Component, OnInit, Input } from "@angular/core";
import { barApiServices } from "../../shared/services/bar.services";
import { forkJoin } from "rxjs/observable/forkJoin";
import { SalesStateApiServices } from "app/shared/services/salesState.services";
import { TokenApiServices } from "app/shared/services/token.services";
import { openStateApiServices } from "app/shared/services/openState.services";
@Component({
  selector: "app-genrate-statment",
  moduleId: module.id,
  templateUrl: "genrateSalesStatment.component.html"
})
export class GenrateSalesStatmentComponent implements OnInit {
  lstBarData;
  userDate;
  itemSizeBeer = ["1500", "1000", "650", "500", "330", "325"];
  itemSizeWine = ["750", "375", "180"];
  getFilterDataBySalesState;
  salesStateDataByDate;
  loading = false;
  itemSalesStateData = [];
  itemNameArray;
  loadTabel = false;
  userSelectDate;

  constructor(
    private barApiServices: barApiServices,
    private salesStateServices: SalesStateApiServices,
    private openStateServices: openStateApiServices,
    private tokenservices: TokenApiServices
  ) { }
  ngOnInit() {
    this.loading = true;
    this.barApiServices.getAllBarData().subscribe(
      data => {
        this.lstBarData = data;
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

  // this method invoke when you select the date form calender.
  getSalesStateData(date) {
    this.loading = true;
    this.userDate = date;
    this.openStateServices.getAllOpenStateDataByDate(date).subscribe(
      response => {
        if (response.length > 0) {
          this.salesStateDataByDate = response;
          this.userSelectDate=date;
          this.processing(this.lstBarData, this.salesStateDataByDate, date);
        } else {
          alert("Sorry You Choosen Date Opening Statement Not Found Please Choose Correct Date.");
        }
       
        this.loading = false;
      },
      err => {
        console.log("Status : ", err.status);
        if (err.status === 401) {
          this.tokenservices.refreshToeknService().subscribe(
            response => { this.ngOnInit() },
            err => { console.error("Error Occured : ", err) });
        }
      });
  }

  processing(mainBarData, salesStateDataByDate, userDate) {
    const tempdata = mainBarData.map((item, key) => {
      const data = item.openState.filter(x => x.createdAt === userDate);
      return {
        openQty: data[0] === undefined ? "" : data[0].openQty,
        itemId: item.itemId,
        itemName: item.itemName,
        itemSize: item.itemSize,
        itemType: item.itemType
      };
    });
    this.getFilterDataBySalesState = tempdata;
    this.itemNameArray = Array.from( new Set(this.getFilterDataBySalesState.map(s => s.itemName)) );
    this.loadTable(this.itemNameArray, this.getFilterDataBySalesState);
  }

  loadTable(itemNameArray, getFilterDataBySalesState) {
    // This  Maping Geting How Many Rows We Need to Create Means Rows Count With Values Filterd On Main Bar item Filleted Array
    const rowsCount = itemNameArray.map((name, key) => { return getFilterDataBySalesState.filter(x => x.itemName === name) });
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
    this.loadTabel = true;
  }

  // This Method take Two Prarameter and Return The Qty By Using Array Find Method
  fetchQty(row, value) {
    const temp = row.find(x => x.itemSize === value);
    return temp === undefined ? "" : temp.openQty;
  }

  // This Method Manage the input form the user And Make Proper Sales Data
  SalesInputMag(productName, size, openQty) {
  var salesQty = prompt( "Please enter your sales quantity for " +productName.name +" - " +size +" ml");
   if(salesQty !== null && salesQty !== ""){
    const data = this.getFilterDataBySalesState.filter( x => x.itemName === productName.name && x.itemSize === size );
    // this line data alredy availbe in array and return intger value
    var idx = this.itemSalesStateData.findIndex( items => data[0].itemId === items.itemId);
    // this condtions check if data availabe the fileter data and return remove that element
    if (idx > -1) {
      const temp = this.itemSalesStateData.filter( items => data[0].itemId !== items.itemId);
      this.itemSalesStateData = temp;
    }
    // this line push the new line code
    this.itemSalesStateData.push({
      salesQty: salesQty,
      createdAt: this.userSelectDate,
      itemId: data[0].itemId
    });
   }else if(salesQty === ""){
    alert("Plese Enter Vaild Input Data Ex : (0-9999).")
   }
    
  }

  // When Submit Button click this Functions Called
  onSubmitPostData() {
    if (this.itemSalesStateData.length === 0) {
      alert("Sorry There is No Data Please Enter Some Data");
    } else {
      this.loading = true;
      const insertOpt = this.itemSalesStateData.map(item => { return this.salesStateServices.saveData(item.itemId, item) });
      forkJoin(insertOpt).subscribe(
        data => {
          this.loading = false;
          alert("Your Data Inserted Successfully");
          window.location.href = "/SalesState";
        },
        err => {
          console.error("Error Occured : ", err);
        }
      );
    }
  }
}
