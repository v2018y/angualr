import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NguiMapModule } from '@ngui/map';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutes, routingComponent } from './app.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { barApiServices } from './shared/services/bar.services';
import { openStateApiServices } from './shared/services/openState.services';
import { OnlineProcess } from './shared/services/process';
import { Store } from './shared/classes/store';
import { TokenApiServices } from './shared/services/token.services';
import { SalesStateApiServices } from './shared/services/salesState.services';
@NgModule({
  declarations: [
    AppComponent,
    routingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE' })
  ],
  providers: [
    barApiServices, 
    openStateApiServices,
    OnlineProcess,
    Store,
    TokenApiServices,
    SalesStateApiServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
