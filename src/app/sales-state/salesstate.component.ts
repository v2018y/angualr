import { Component, OnInit } from '@angular/core';
import { SalesStateApiServices } from 'app/shared/services/salesState.services';

@Component({
  selector: 'app-sales-state',
  moduleId: module.id,
  templateUrl: 'salesstate.component.html',
})
export class SalesStateComponent implements OnInit {

  constructor(private salesStateService: SalesStateApiServices) { }
  loading = true;
  salesStateData;
  salesStateDummy;

  ngOnInit() {
    this.salesStateService.getAllSalesStateData().subscribe(
      data => {
        const dummy = Array.from(new Set(data.map(s => s.createdAt))).map((createdAt, key) => {
          return {
            id: key,
            date: data.find(s => s.createdAt === createdAt).createdAt
          }
        })
        this.salesStateDummy = dummy;
        this.loading = false;
      },
      err => {
        console.error('Error Occured : ', err);
      }
    )
  }
}