import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../core/auth.guard';
import { ForgotComponent } from './forgot/forgot.component';



const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirect /auth → /auth/login
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'forgot', component: ForgotComponent, canActivate: [AuthGuard] }
];
  
  

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class AuthRoutingModule {}
