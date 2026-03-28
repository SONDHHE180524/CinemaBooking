import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { ProfileComponent } from './features/profile/profile.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Trang công khai
  { path: '', component: HomeComponent },

  // Chỉ dành cho khách (chưa đăng nhập)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Yêu cầu đăng nhập
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },

  // Admin module (lazy loading)
  { 
    path: 'admin', 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard] 
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
