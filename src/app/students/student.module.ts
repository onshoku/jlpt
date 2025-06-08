import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { StatusComponent } from './components/status/status.component';
import { StudentRoutingModule } from './student-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderStudentComponent } from './components/header-student/header-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
  declarations: [
    DashboardComponent,
    HistoryComponent,
    ProfileComponent,
    RegistrationFormComponent,
    StatusComponent,
    HeaderStudentComponent,
  ],
  imports: [
    StudentRoutingModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule
]
})
export class StudentModule { }
