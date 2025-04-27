import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { StatusComponent } from './components/status/status.component';
import { StudentRoutingModule } from './student-routing.module';




@NgModule({
  declarations: [
    DashboardComponent,
    HistoryComponent,
    ProfileComponent,
    RegistrationFormComponent,
    StatusComponent
  ],
  imports: [
    StudentRoutingModule,
    CommonModule,
  ]
})
export class StudentModule { }
