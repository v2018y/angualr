import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { barApiServices } from '../../shared/services/bar.services';
import { Bar } from '../../shared/classes/bar';
import { TokenApiServices } from 'app/shared/services/token.services';

@Component({
  selector: 'app-update-bar',
  moduleId: module.id,
  templateUrl: 'update-bar.component.html',
})
export class UpdateBarComponent implements OnInit {

  id: number;
  userBar: Bar;
  loading = true;
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

  constructor(private route: ActivatedRoute, private barSerives: barApiServices,private tokenService: TokenApiServices) {
    this.route.params.subscribe(param => { this.id = param.id; });
  }

  ngOnInit() {
    this.barSerives.getBarDataById(this.id).subscribe(
      data => {
        this.userBar = data;
        this.loading = false;
      },
      err => {
        console.log('Status : ',err.status);
        if (err.status === 401) {
          this.tokenService.refreshToeknService().subscribe(
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
  onUpdateSubmit() {
    this.loading=true;
    this.barSerives.updateData(this.userBar, this.id).subscribe(
      response => {
        this.loading=false;
        alert('Your Selected  Item id ' + this.id + ' Data is Updated');
        window.location.href = '/bar';
      },
      err => {
        console.log('Status : ',err.status);
        if (err.status === 401) {
          this.tokenService.refreshToeknService().subscribe(
            response => {
              this.onUpdateSubmit();
            },
            err => {
              console.error("Error Occured : ", err);
            });
        }
      });
  }
}
