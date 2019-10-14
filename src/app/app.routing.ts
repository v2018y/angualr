import { Routes,CanActivate } from '@angular/router';

import { BarComponent } from './bar/bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpenStateComponent } from '../app/open-state/openstate.component';
import { AddBarComponent } from './bar/add-bar/add-bar.component';
import { UpdateBarComponent } from './bar/update-bar/update-bar.component';
import { GenrateStatmentComponent } from './open-state/genrate-statment/genrate-statment.component';
import { SheetComponent } from './open-state/sheet/sheet.component';
import { UserComponent } from './user/user.component';
import { DeleteSheetComponent } from './open-state/deleteSheet/deleteSheet.component';
import { SalesStateComponent } from './sales-state/salesstate.component';
import { GenrateSalesStatmentComponent } from './sales-state/genrate-statement/genrateSalesStatment.component';
import { DeleteSalesSheetComponent } from './sales-state/deleteSheet/deleteSalesSheet.component';
import { SalesSheetStateComponent } from './sales-state/sheet/salesState.component';

export const AppRoutes: Routes = [
    {   path: '',  redirectTo: 'dashboard', pathMatch: 'full'},
    {   path: 'dashboard',component: DashboardComponent},
    {   path: 'bar',
        children: [
          { path: '', component: BarComponent },
          { path: 'barAdd', component: AddBarComponent },
          { path: 'barUpdate/:id', component: UpdateBarComponent }
        ]
    },
    {   path: 'OpenState', 
        children: [
            { path: '', component: OpenStateComponent},
            { path: 'genarateStatement', component: GenrateStatmentComponent },
            { path: 'sheet/:date', component: SheetComponent },
            { path: 'deleteSheet/:date', component: DeleteSheetComponent }
        ]
    },
    {   path: 'SalesState', 
        children: [
            { path: '', component: SalesStateComponent},
            { path: 'genarateStatement', component: GenrateSalesStatmentComponent },
            { path: 'sheet/:date', component: SalesSheetStateComponent },
            { path: 'deleteSheet/:date', component: DeleteSalesSheetComponent }
        ]
    }
]

export const routingComponent = [
    BarComponent ,
    OpenStateComponent ,
    AddBarComponent,
    UpdateBarComponent,
    GenrateStatmentComponent,
    DashboardComponent,
    SheetComponent,
    UserComponent,
    DeleteSheetComponent,
    GenrateSalesStatmentComponent,
    SalesStateComponent,
    DeleteSalesSheetComponent,
    SalesSheetStateComponent
  ];