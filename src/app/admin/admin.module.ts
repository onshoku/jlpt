import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditWebsiteComponent } from './components/edit-website/edit-website.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    EditWebsiteComponent,
    ReportsComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
  ]
})
export class AdminModule { }
