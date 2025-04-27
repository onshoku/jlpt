import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { HistoryComponent } from './components/history/history.component';
import { StatusComponent } from './components/status/status.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StudentAuthGuard } from '../core/student-auth.guard';

const routes: Routes = [
    {
      path: '',
      canActivateChild: [StudentAuthGuard],  // Apply guard to all child routes
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'registration', component: RegistrationFormComponent },
        { path: 'history', component: HistoryComponent },
        { path: 'status', component: StatusComponent },
        { path: 'profile', component: ProfileComponent }
      ]
    }
];
  
  
  

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class StudentRoutingModule {}
