import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditWebsiteComponent } from './components/edit-website/edit-website.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AdminAuthGuard } from '../core/admin-auth.guard';

const routes: Routes = [
    {
      path: '',
      canActivateChild: [AdminAuthGuard],  // Apply guard to all child routes
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'edit-website', component: EditWebsiteComponent },
        { path: 'reports', component: ReportsComponent }
      ]
    }
];
  
  

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class AdminRoutingModule {}
