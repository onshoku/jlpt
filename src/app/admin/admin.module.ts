import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditWebsiteComponent } from './components/edit-website/edit-website.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderAdminComponent } from './components/header-admin/header-admin.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    EditWebsiteComponent,
    ReportsComponent,
    HeaderAdminComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    BaseChartDirective,
  ]
})
export class AdminModule { }
